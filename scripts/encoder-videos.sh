#!/usr/bin/env bash
# Encode les rushes drone 4K en versions web légères.
#
# Pour chaque plan : un MP4 H.264 1080p (compat universelle), un MP4 720p
# (servi aux petits écrans) et une image poster JPEG affichée avant lecture.
#
# Usage : SOURCE=~/Desktop ./scripts/encoder-videos.sh
set -euo pipefail

SOURCE="${SOURCE:-$HOME/Desktop}"
DEST="$(cd "$(dirname "$0")/.." && pwd)/public/videos"
mkdir -p "$DEST"

# nom-de-sortie | montage
#
# `pole` est le plan générique servi par défaut à toutes les pages qui n'ont
# pas encore le leur. Les autres entrées écrasent ce défaut page par page :
# le nom de sortie doit correspondre à la prop `video` passée à EnTetePage.
#
# Le montage est une suite de segments séparés par des virgules, mis bout à
# bout dans l'ordre donné. Chaque segment s'écrit :
#
#     fichier:début:durée[:inverse]
#
# Une durée de 0 prend la source jusqu'à la fin (utile quand elle a déjà été
# découpée en amont). Le suffixe `inverse` lit le segment à rebours, ce qui
# permet notamment de repartir d'où le plan précédent s'est arrêté.
PLANS=(
  "pole|1.mp4:0:12"
  "commerces|bat-rond-trimed.mp4:0:0"
  "services|mondial-relay.MP4:0:0,powerdot.MP4:0:0:inverse"
  "infos-pratiques|info.mp4:0:0"
  "contact|contact.mp4:0:0"
)

# Les fichiers intermédiaires du montage sont jetables : un seul dossier
# temporaire, nettoyé à la sortie du script quoi qu'il arrive.
TEMPO="$(mktemp -d)"
trap 'rm -rf "$TEMPO"' EXIT

for plan in "${PLANS[@]}"; do
  IFS='|' read -r nom montage <<< "$plan"
  echo "== $nom  ($montage)"

  # Chaque segment est normalisé (même définition, même cadence, même codec)
  # avant d'être concaténé : sans cela, `concat` refuse des flux hétérogènes.
  segments=()
  manquant=""
  IFS=',' read -ra liste <<< "$montage"
  for i in "${!liste[@]}"; do
    IFS=':' read -r fichier debut duree sens <<< "${liste[$i]}"
    src="$SOURCE/$fichier"
    if [ ! -f "$src" ]; then
      echo "!! source absente : $src"
      manquant=1
      break
    fi

    if [ "$duree" = "0" ]; then
      reelle=$(ffprobe -v error -show_entries format=duration \
        -of default=noprint_wrappers=1:nokey=1 "$src")
      duree=$(echo "$reelle - $debut" | bc)
      coupe=(-ss "$debut")
    else
      coupe=(-ss "$debut" -t "$duree")
    fi

    # `reverse` charge le segment entier en mémoire : raison de plus pour
    # normaliser en 1080p d'abord et inverser ensuite, jamais en 4K.
    filtres="scale=1920:-2:flags=lanczos,fps=25,setsar=1"
    [ "${sens:-}" = "inverse" ] && filtres="$filtres,reverse"

    segment="$TEMPO/$nom-$i.mp4"
    ffmpeg -v error -y "${coupe[@]}" -i "$src" \
      -vf "$filtres" -an \
      -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p "$segment"
    segments+=("$segment")
  done
  [ -n "$manquant" ] && continue

  # Un seul segment : inutile de repasser par concat.
  if [ "${#segments[@]}" -eq 1 ]; then
    monte="${segments[0]}"
  else
    monte="$TEMPO/$nom-monte.mp4"
    : > "$TEMPO/$nom.txt"
    for segment in "${segments[@]}"; do
      echo "file '$segment'" >> "$TEMPO/$nom.txt"
    done
    ffmpeg -v error -y -f concat -safe 0 -i "$TEMPO/$nom.txt" -c copy "$monte"
  fi

  duree=$(ffprobe -v error -show_entries format=duration \
    -of default=noprint_wrappers=1:nokey=1 "$monte")

  # Le fondu d'ouverture/fermeture masque la coupure de la boucle.
  fondu="fade=t=in:st=0:d=0.8,fade=t=out:st=$(echo "$duree - 0.8" | bc):d=0.8"

  # Débit plafonné plutôt que CRF seul : les plans très mobiles (feuillage,
  # travelling) explosent sinon à plus de 10 Mo, ce qui est inacceptable
  # pour une vidéo décorative chargée à chaque visite. Le plafond est resserré
  # sur les plans longs pour que le poids final reste comparable d'une page à
  # l'autre : c'est le poids qui compte pour le visiteur, pas le débit.
  if (( $(echo "$duree > 20" | bc) )); then
    plafond_1080=1300k; plafond_720=700k
  else
    plafond_1080=2200k; plafond_720=1100k
  fi
  ffmpeg -v error -y -i "$monte" \
    -vf "scale=1920:-2:flags=lanczos,$fondu" -r 25 -an \
    -c:v libx264 -profile:v high -preset slow \
    -crf 30 -maxrate "$plafond_1080" -bufsize 4400k \
    -pix_fmt yuv420p -movflags +faststart "$DEST/$nom-1080.mp4"

  ffmpeg -v error -y -i "$monte" \
    -vf "scale=1280:-2:flags=lanczos,$fondu" -r 25 -an \
    -c:v libx264 -profile:v high -preset slow \
    -crf 32 -maxrate "$plafond_720" -bufsize 2200k \
    -pix_fmt yuv420p -movflags +faststart "$DEST/$nom-720.mp4"

  # Poster pris après le fondu d'ouverture, sinon l'image est noire.
  ffmpeg -v error -y -ss 1.5 -i "$monte" \
    -vf "scale=1920:-2:flags=lanczos" -frames:v 1 -q:v 6 "$DEST/$nom.jpg"
done

echo && ls -lh "$DEST"

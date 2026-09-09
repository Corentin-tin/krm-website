#!/usr/bin/env bash
# Encode la vidéo de présentation du pôle en versions web.
#
# Distinct de `encoder-videos.sh`, qui produit les plans décoratifs muets
# posés en fond de bandeau. Ici la vidéo est un contenu à part entière :
# elle garde son son, ne boucle pas (donc pas de fondu de raccord) et n'est
# téléchargée qu'au clic du visiteur.
#
# Débit moyen imposé en deux passes plutôt que CRF : ces rushes drone
# (feuillage, travelling permanent) montent à plus de 30 Mo en qualité
# constante, ce qui est intenable pour une page d'accueil. Deux passes
# donnent un poids prévisible à qualité maximale pour ce poids.
#
# Usage : SOURCE=~/Desktop/albizia-movie.mp4 ./scripts/encoder-presentation.sh
set -euo pipefail

SOURCE="${SOURCE:-$HOME/Desktop/albizia-movie.mp4}"
NOM="${NOM:-presentation}"
DEST="$(cd "$(dirname "$0")/.." && pwd)/public/videos"
mkdir -p "$DEST"

if [ ! -f "$SOURCE" ]; then
  echo "!! source absente : $SOURCE" >&2
  exit 1
fi

# Les journaux de la première passe sont jetables.
TEMPO="$(mktemp -d)"
trap 'rm -rf "$TEMPO"' EXIT

# definition | largeur | debit video | plafond | tampon | debit audio
VERSIONS=(
  "1080|1920|1900k|2600k|3800k|128k"
  "720|1280|950k|1400k|1900k|96k"
)

for version in "${VERSIONS[@]}"; do
  IFS='|' read -r suffixe largeur debit plafond tampon audio <<< "$version"
  echo "== $NOM-$suffixe"

  commun=(-vf "scale=$largeur:-2:flags=lanczos" -r 25
          -c:v libx264 -profile:v high -preset slow
          -b:v "$debit" -maxrate "$plafond" -bufsize "$tampon"
          -passlogfile "$TEMPO/$suffixe")

  # Première passe : analyse seule, aucun fichier de sortie à garder.
  ffmpeg -v error -y -i "$SOURCE" "${commun[@]}" -pass 1 -an -f null /dev/null

  ffmpeg -v error -y -i "$SOURCE" "${commun[@]}" -pass 2 \
    -c:a aac -b:a "$audio" -ac 2 \
    -pix_fmt yuv420p -movflags +faststart "$DEST/$NOM-$suffixe.mp4"
done

# Affiche de couverture : plan large d'ensemble pris au début, avant que la
# caméra ne descende sur les détails. C'est la seule image que la page charge
# tant que personne ne lance la lecture.
#
# 3 s et pas plus tard : le montage enchaîne vers 8 s sur un carton-titre posé
# sur un fond flouté, qui ferait une affiche illisible — et redondante avec le
# titre déjà affiché au-dessus du lecteur.
ffmpeg -v error -y -ss 3 -i "$SOURCE" \
  -vf "scale=1920:-2:flags=lanczos" -frames:v 1 -q:v 6 "$DEST/$NOM.jpg"

echo && ls -lh "$DEST/$NOM"*

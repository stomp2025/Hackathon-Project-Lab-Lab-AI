import sys
import os

# Ajoutez le répertoire racine au path Python
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Importez votre application principale
from main import app

# Handler pour Vercel
handler = app
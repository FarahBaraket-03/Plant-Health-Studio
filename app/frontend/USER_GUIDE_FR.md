# 📖 Guide Utilisateur - Analyse d'Images

## 🎯 Comprendre l'Analyse d'Images

Lorsque vous téléchargez une image de feuille, l'application effectue plusieurs analyses pour détecter les maladies. Voici ce que signifie chaque visualisation.

---

## 🔍 Analyses Visuelles

### 1. Sobel Edge Detection (Détection de Contours Sobel)

**Qu'est-ce que c'est?**  
Une technique qui détecte les bords et contours dans l'image en calculant les changements d'intensité.

**À quoi ça sert?**  
- Identifier les bordures des feuilles
- Détecter les zones de transition entre tissus sains et malades
- Révéler les structures cachées (nervures, lésions)

**Comment l'interpréter?**  
- **Lignes blanches épaisses** = Contours forts (bordures de feuilles)
- **Lignes fines** = Détails internes (nervures, petites lésions)
- **Zones sombres** = Régions uniformes

---

### 2. RGB Histogram (Histogramme RGB)

**Qu'est-ce que c'est?**  
Un graphique montrant la distribution des couleurs Rouge, Vert et Bleu dans l'image.

**À quoi ça sert?**  
- Analyser la composition colorimétrique
- Détecter les anomalies de pigmentation
- Identifier les décolorations causées par les maladies

**Comment l'interpréter?**  
- **Pic vert élevé** = Feuille saine avec beaucoup de chlorophylle
- **Pics rouge/jaune** = Possibles zones malades ou sèches
- **Distribution large** = Variation de couleurs (peut indiquer une maladie)

---

### 3. Grayscale (Niveaux de Gris)

**Qu'est-ce que c'est?**  
Conversion de l'image en noir et blanc pour analyser uniquement la luminosité.

**À quoi ça sert?**  
- Révéler les variations de texture
- Analyser l'intensité lumineuse
- Simplifier l'analyse en éliminant la couleur

**Comment l'interpréter?**  
- **Zones claires** = Régions lumineuses (souvent saines)
- **Zones sombres** = Régions ombragées ou malades
- **Contraste élevé** = Texture variée (peut indiquer des lésions)

---

### 4. Canny Edge Detection (Détection de Contours Canny)

**Qu'est-ce que c'est?**  
Une méthode avancée de détection de contours qui produit des lignes fines et précises.

**À quoi ça sert?**  
- Identifier les structures fines (nervures, petites lésions)
- Détecter les contours avec précision
- Révéler les détails cachés

**Comment l'interpréter?**  
- **Lignes blanches fines** = Contours précis
- **Réseau de lignes** = Structure de la feuille (nervures)
- **Zones vides** = Régions uniformes sans détails

---

### 5. HSV Color Space (Espace Colorimétrique HSV)

**Qu'est-ce que c'est?**  
Une représentation alternative des couleurs basée sur la Teinte, Saturation et Valeur.

**À quoi ça sert?**  
- Faciliter la séparation des couleurs
- Mieux identifier les zones vertes (feuilles)
- Analyser les variations de couleur indépendamment de la luminosité

**Comment l'interpréter?**  
- **Teinte (H)** = Type de couleur (vert, jaune, rouge)
- **Saturation (S)** = Intensité de la couleur
- **Valeur (V)** = Luminosité

---

### 6. Green Leaf Mask (Masque de Feuille Verte)

**Qu'est-ce que c'est?**  
Un masque binaire (noir et blanc) qui isole uniquement les pixels verts de la feuille.

**À quoi ça sert?**  
- Séparer la feuille du fond
- Identifier la zone d'intérêt
- Préparer l'extraction de caractéristiques

**Comment l'interpréter?**  
- **Blanc** = Pixels verts (feuille)
- **Noir** = Fond ou zones non-vertes
- **Forme claire** = Bonne segmentation

---

### 7. Segmented Leaf (Feuille Segmentée)

**Qu'est-ce que c'est?**  
L'image originale avec uniquement la feuille visible (fond supprimé).

**À quoi ça sert?**  
- Visualiser la zone analysée
- Confirmer la qualité de la segmentation
- Isoler la feuille pour l'analyse

**Comment l'interpréter?**  
- **Feuille visible** = Segmentation réussie
- **Fond noir** = Zone ignorée
- **Contours nets** = Bonne isolation

---

## 🧪 Analyse de Texture

### GLCM (Gray-Level Co-occurrence Matrix)

**Qu'est-ce que c'est?**  
Une méthode qui analyse les relations spatiales entre pixels pour caractériser la texture.

**Propriétés extraites:**

1. **Contraste**
   - Mesure les variations locales d'intensité
   - Élevé = Texture rugueuse (lésions, taches)
   - Faible = Texture lisse (feuille saine)

2. **Corrélation**
   - Mesure les dépendances linéaires entre pixels
   - Élevée = Texture régulière
   - Faible = Texture aléatoire

3. **Énergie**
   - Mesure l'uniformité de la texture
   - Élevée = Texture uniforme
   - Faible = Texture variée

4. **Homogénéité**
   - Mesure la similarité des pixels voisins
   - Élevée = Texture homogène
   - Faible = Texture hétérogène

### LBP (Local Binary Pattern)

**Qu'est-ce que c'est?**  
Une méthode qui compare chaque pixel avec ses voisins pour créer un code binaire représentant la texture locale.

**Caractéristiques:**
- **Invariant à l'illumination** = Fonctionne même avec éclairage variable
- **24 voisins** (P=24) = Analyse détaillée
- **Rayon 3** (R=3) = Zone d'analyse
- **26 bins** = Histogramme des patterns

**Utilité:**  
Détecte les motifs de texture répétitifs caractéristiques de certaines maladies.

---

## 📊 Extraction de Caractéristiques

### 118 Caractéristiques Totales

L'application extrait automatiquement 118 caractéristiques numériques de chaque image:

#### 78 Caractéristiques de Couleur
- **48** = Histogrammes RGB (16 bins × 3 canaux)
- **6** = Statistiques RGB (moyenne + écart-type par canal)
- **18** = Histogramme HSV (canal H, 18 bins)
- **6** = Statistiques HSV (moyenne + écart-type par canal)

#### 34 Caractéristiques de Texture
- **8** = GLCM (4 propriétés × 2 statistiques)
- **26** = LBP (histogramme 26 bins)

#### 6 Caractéristiques de Forme
- Aire de la feuille
- Périmètre
- Circularité
- Ratio d'aspect
- Solidité
- Étendue

---

## 🔄 Pipeline de Prétraitement

Chaque image passe par 5 étapes avant l'analyse:

### 1️⃣ Resize (Redimensionnement)
- **Action**: Redimensionner à 224×224 pixels
- **Pourquoi**: Uniformiser la taille pour le traitement

### 2️⃣ RGB → HSV
- **Action**: Convertir l'espace colorimétrique
- **Pourquoi**: Faciliter la segmentation des couleurs

### 3️⃣ CLAHE (Égalisation Adaptative)
- **Action**: Améliorer le contraste sur le canal V (luminosité)
- **Pourquoi**: Révéler les détails cachés dans les zones sombres/claires

### 4️⃣ Gaussian Blur (Flou Gaussien)
- **Action**: Appliquer un flou léger (kernel 5×5)
- **Pourquoi**: Réduire le bruit et lisser l'image

### 5️⃣ Normalize (Normalisation)
- **Action**: Mettre les valeurs entre 0 et 1
- **Pourquoi**: Standardiser pour l'extraction de caractéristiques

---

## 🎓 Conseils d'Utilisation

### Pour de Meilleurs Résultats

✅ **Bonne Qualité d'Image**
- Résolution minimale: 224×224 pixels
- Éclairage uniforme
- Feuille bien visible

✅ **Cadrage Optimal**
- Feuille centrée
- Fond contrasté (pas trop vert)
- Éviter les ombres fortes

✅ **Conditions de Prise de Vue**
- Lumière naturelle ou artificielle uniforme
- Éviter le contre-jour
- Feuille à plat (pas froissée)

### Interpréter les Résultats

🔍 **Comparer les 3 Modèles**
- ML (RandomForest) = Basé sur les 118 caractéristiques
- DL Pretrained (ResNet18) = Apprentissage profond pré-entraîné
- DL Scratch (SimpleCNN) = Réseau personnalisé

📊 **Analyser les Visualisations**
- Sobel/Canny = Vérifier la structure de la feuille
- Histogram = Vérifier la distribution des couleurs
- Mask = Vérifier la qualité de la segmentation

⚠️ **Confiance des Prédictions**
- Score > 90% = Haute confiance
- Score 70-90% = Confiance moyenne
- Score < 70% = Faible confiance (vérifier l'image)

---

## ❓ FAQ

### Pourquoi plusieurs analyses?

Chaque méthode révèle des informations différentes:
- **Sobel/Canny** = Structure et contours
- **Histogram** = Distribution des couleurs
- **GLCM/LBP** = Texture et patterns
- **HSV/Mask** = Segmentation et isolation

### Quelle analyse est la plus importante?

Toutes sont complémentaires! Le modèle ML utilise les 118 caractéristiques extraites de toutes ces analyses.

### Puis-je télécharger les analyses?

Actuellement non, mais c'est prévu dans une future mise à jour.

### Les analyses sont-elles en temps réel?

Oui! Toutes les analyses sont générées instantanément lors du téléchargement de l'image.

---

## 📚 Ressources Supplémentaires

- **Documentation Backend**: `app/backend/PREPROCESSING.md`
- **Guide Technique**: `app/frontend/IMAGE_ANALYSIS_IMPROVEMENTS.md`
- **Code Source**: `app/frontend/app/page.tsx`

---

**Besoin d'aide?** Consultez la documentation complète ou contactez le support technique.

🌿 **Bonne analyse!**

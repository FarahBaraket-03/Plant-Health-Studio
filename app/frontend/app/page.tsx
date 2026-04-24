"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Activity, BookOpen, Brain, ImageIcon, Leaf, ScanSearch, Sparkles, Upload } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

type Prediction = {
  class: string;
  score: number;
  explanation: string;
  n_components?: number;
  variance_retained?: number;
};

type Analysis = {
  sobel: string;
  histogram: string;
  grayscale: string;
  canny: string;
  hsv?: string;
  green_mask?: string;
  masked_leaf?: string;
};

type PredictionResponse = {
  dl: Prediction;
  dl_scratch?: Prediction;
  ml: Prediction;
  ml_pca?: Prediction;
  analysis: Analysis;
  meta?: {
    feature_count?: number;
    pca_components?: number;
  };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function PlantClassifier() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const analysisCards = useMemo(() => {
    if (!result?.analysis) {
      return [] as Array<{ 
        label: string; 
        key: keyof Analysis;
        description: string;
        purpose: string;
      }>;
    }
    
    const baseCards = [
      { 
        label: "Sobel Edge Detection", 
        key: "sobel" as const,
        description: "Détecte les contours en calculant le gradient d'intensité de l'image",
        purpose: "Identifie les bordures des feuilles et les zones de transition entre tissus sains et malades"
      },
      { 
        label: "RGB Histogram", 
        key: "histogram" as const,
        description: "Distribution des couleurs (Rouge, Vert, Bleu) dans l'image",
        purpose: "Analyse la composition colorimétrique pour détecter les anomalies de pigmentation"
      },
      { 
        label: "Grayscale", 
        key: "grayscale" as const,
        description: "Conversion en niveaux de gris pour analyser la luminosité",
        purpose: "Révèle les variations de texture et d'intensité lumineuse indépendamment de la couleur"
      },
      { 
        label: "Canny Edge Detection", 
        key: "canny" as const,
        description: "Détection avancée des contours avec suppression du bruit",
        purpose: "Identifie précisément les structures fines comme les nervures et les lésions"
      },
    ];
    
    const additionalCards = [];
    
    if (result.analysis.hsv) {
      additionalCards.push({
        label: "HSV Color Space",
        key: "hsv" as const,
        description: "Représentation en Teinte-Saturation-Valeur pour une meilleure séparation des couleurs",
        purpose: "Facilite la segmentation des zones vertes (feuilles) et l'analyse des variations de couleur"
      });
    }
    
    if (result.analysis.green_mask) {
      additionalCards.push({
        label: "Green Leaf Mask",
        key: "green_mask" as const,
        description: "Masque binaire isolant les pixels verts de la feuille",
        purpose: "Sépare la feuille du fond pour une analyse précise de la zone d'intérêt"
      });
    }
    
    if (result.analysis.masked_leaf) {
      additionalCards.push({
        label: "Segmented Leaf",
        key: "masked_leaf" as const,
        description: "Feuille isolée après application du masque vert",
        purpose: "Permet l'extraction de caractéristiques uniquement sur la zone foliaire"
      });
    }
    
    return [...baseCards, ...additionalCards];
  }, [result]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setErrorMessage("");
  };

  const classifyImage = async () => {
    if (!image) {
      return;
    }
    setLoading(true);
    setResult(null);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ detail: "Unknown server error." }));
        throw new Error(payload.detail ?? "Prediction failed.");
      }

      const payload = (await response.json()) as PredictionResponse;
      setResult(payload);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Error connecting to backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="organic-blob absolute -left-24 top-12 h-72 w-72 bg-primary/20 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-[35%_65%_70%_30%_/_40%_30%_70%_60%] bg-secondary/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <header className="mb-12 rounded-[2.5rem] border border-border/50 bg-white/65 p-8 text-center shadow-soft backdrop-blur-md md:p-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10"
          >
            <Leaf className="h-8 w-8 text-primary" />
          </motion.div>
          <h1 className="mb-3 text-5xl text-foreground md:text-7xl">
            Plant <span className="text-primary">Health</span> Studio
          </h1>
          <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
            Upload a leaf image to compare Machine Learning, pretrained Deep Learning, and scratch Deep Learning predictions, with confidence scores,
            explanations, and visual transforms.
          </p>
          <div className="mt-6">
            <Link 
              href="/docs"
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary/20"
            >
              <BookOpen className="h-4 w-4" />
              View Technical Documentation
            </Link>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-2">
          <motion.article
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[2.5rem] border border-border/50 bg-[#FEFEFA]/90 p-6 shadow-soft md:p-8"
          >
            <h2 className="mb-6 text-3xl text-foreground">Image Upload</h2>

            <label className="group relative block cursor-pointer rounded-[2rem] border-2 border-dashed border-border bg-white/60 p-6 text-center transition-all duration-300 hover:border-primary focus-within:border-primary">
              <input
                type="file"
                className="sr-only"
                onChange={handleImageChange}
                accept="image/*"
                aria-label="Upload plant image"
              />

              {!preview ? (
                <div className="space-y-4 py-10">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-semibold text-foreground">Drop your image or click to browse</p>
                  <p className="text-sm text-muted-foreground">Accepted formats: JPG, PNG, WEBP</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-[1.75rem] border border-border/50">
                  <img src={preview} alt="Uploaded preview" className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              )}
            </label>

            <div className="mt-6 space-y-3">
              <button
                onClick={classifyImage}
                disabled={!image || loading}
                className="h-12 w-full rounded-full bg-primary px-8 text-base font-bold text-primary-foreground shadow-soft transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_24px_-4px_rgba(93,112,82,0.25)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Analyzing..." : "Classify This Leaf"}
              </button>

              {errorMessage ? (
                <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {errorMessage}
                </p>
              ) : null}
            </div>
          </motion.article>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-64 flex-col items-center justify-center rounded-[2rem] border border-border/50 bg-white/70 p-8 text-center shadow-soft"
                >
                  <div className="mb-3 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="font-semibold text-primary">Running ML + DL (pretrained + scratch) inference...</p>
                </motion.div>
              ) : null}

              {!loading && !result ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-64 flex-col items-center justify-center rounded-[2rem] border border-border/50 bg-muted/30 p-8 text-center"
                >
                  <ImageIcon className="mb-3 h-14 w-14 text-muted-foreground" />
                  <p className="text-muted-foreground">Prediction results will appear here.</p>
                </motion.div>
              ) : null}

              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <article className="asymmetric-card border border-border/50 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-float">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Brain className="h-6 w-6 text-primary" />
                      </span>
                      <h3 className="text-2xl text-foreground">DL Pretrained</h3>
                    </div>
                    <p className="mb-1 text-xl font-semibold text-foreground">{result.dl.class}</p>
                    <p className="text-sm text-muted-foreground">{result.dl.explanation}</p>
                  </article>

                  {result.dl_scratch ? (
                    <article className="asymmetric-card border border-border/50 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-float">
                      <div className="mb-2 flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          <Brain className="h-6 w-6 text-primary" />
                        </span>
                        <h3 className="text-2xl text-foreground">DL Scratch</h3>
                      </div>
                      <p className="mb-1 text-xl font-semibold text-foreground">{result.dl_scratch.class}</p>
                      <p className="text-sm text-muted-foreground">{result.dl_scratch.explanation}</p>
                    </article>
                  ) : null}

                  <article className="asymmetric-card border border-border/50 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-float">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
                        <Sparkles className="h-6 w-6 text-secondary" />
                      </span>
                      <h3 className="text-2xl text-foreground">Machine Learning</h3>
                    </div>
                    <p className="mb-1 text-xl font-semibold text-foreground">{result.ml.class}</p>
                    <p className="text-sm text-muted-foreground">{result.ml.explanation}</p>
                    <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">Features: {result.meta?.feature_count ?? "n/a"}</p>
                  </article>

                  {result.ml_pca ? (
                    <article className="asymmetric-card border border-border/50 bg-gradient-to-br from-secondary/5 to-primary/5 p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-float">
                      <div className="mb-2 flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20">
                          <Activity className="h-6 w-6 text-secondary" />
                        </span>
                        <div>
                          <h3 className="text-2xl text-foreground">ML + PCA</h3>
                          <p className="text-xs text-muted-foreground">Dimensionality Reduction</p>
                        </div>
                      </div>
                      <p className="mb-1 text-xl font-semibold text-foreground">{result.ml_pca.class}</p>
                      <p className="text-sm text-muted-foreground">{result.ml_pca.explanation}</p>
                      <div className="mt-3 flex gap-2">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {result.ml_pca.n_components} components
                        </span>
                        <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                          {((result.ml_pca.variance_retained ?? 0.95) * 100).toFixed(0)}% variance
                        </span>
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {result.meta?.feature_count && result.ml_pca.n_components 
                            ? `${(((result.meta.feature_count - result.ml_pca.n_components) / result.meta.feature_count) * 100).toFixed(0)}% reduction`
                            : 'Optimized'}
                        </span>
                      </div>
                    </article>
                  ) : null}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </section>

        {result ? (
          <section className="mt-10 rounded-[2.5rem] border border-border/50 bg-white/70 p-6 shadow-soft md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <ScanSearch className="h-5 w-5 text-primary" />
              </span>
              <div>
                <h2 className="text-3xl text-foreground">Image Analysis</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Visualisations des transformations d'image utilisées pour l'extraction de caractéristiques
                </p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {analysisCards.map((card) => (
                <motion.article
                  key={card.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  className="rounded-[2rem] border border-border/50 bg-[#FEFEFA] p-4 shadow-soft transition-all duration-300"
                >
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-primary" />
                      <h3 className="text-base font-bold text-foreground">{card.label}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      <span className="font-semibold">Description:</span> {card.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold">Utilité:</span> {card.purpose}
                    </p>
                  </div>
                  <div className="relative group">
                    <img
                      src={`data:image/png;base64,${result.analysis[card.key]}`}
                      alt={`${card.label} transform`}
                      className="aspect-square w-full rounded-xl object-cover border border-border/30"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-xl transition-all duration-300" />
                  </div>
                </motion.article>
              ))}
            </div>
            
            {/* Technical Details Section */}
            <div className="mt-8 rounded-[2rem] border border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Détails Techniques de l'Analyse
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">🔍 Sobel Edge Detection</h4>
                    <p className="text-xs text-muted-foreground">
                      Utilise des opérateurs de convolution pour calculer les gradients horizontaux (Gx) et verticaux (Gy). 
                      La magnitude finale est √(Gx² + Gy²). Idéal pour détecter les changements brusques d'intensité.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">📊 RGB Histogram</h4>
                    <p className="text-xs text-muted-foreground">
                      Représente la distribution des pixels pour chaque canal de couleur (Rouge, Vert, Bleu). 
                      Les pics indiquent les couleurs dominantes. Utile pour identifier les décolorations causées par les maladies.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">⚫ Grayscale Conversion</h4>
                    <p className="text-xs text-muted-foreground">
                      Convertit l'image en niveaux de gris en utilisant la formule: Gray = 0.299R + 0.587G + 0.114B. 
                      Simplifie l'analyse en éliminant l'information de couleur tout en préservant la structure.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">✨ Canny Edge Detection</h4>
                    <p className="text-xs text-muted-foreground">
                      Algorithme multi-étapes: lissage gaussien → gradient → suppression non-maximale → seuillage par hystérésis. 
                      Produit des contours fins et précis, idéal pour détecter les structures fines des feuilles.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">🎨 HSV Color Space</h4>
                    <p className="text-xs text-muted-foreground">
                      Sépare la teinte (H), la saturation (S) et la valeur/luminosité (V). Plus intuitif que RGB pour 
                      la segmentation des couleurs. Permet d'isoler facilement les zones vertes des feuilles.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">🍃 Green Leaf Segmentation</h4>
                    <p className="text-xs text-muted-foreground">
                      Utilise un seuillage HSV (H: 25-90°, S: 30-255, V: 30-255) pour créer un masque binaire. 
                      Isole la feuille du fond, permettant l'extraction de caractéristiques de forme précises.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Additional Texture Analysis Info */}
              <div className="mt-6 pt-6 border-t border-border/30">
                <h4 className="text-base font-bold text-foreground mb-3">Analyse de Texture Avancée</h4>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl bg-white/50 p-3">
                    <h5 className="text-sm font-semibold text-foreground mb-1">GLCM (Gray-Level Co-occurrence Matrix)</h5>
                    <p className="text-xs text-muted-foreground">
                      Analyse les relations spatiales entre pixels. Extrait 4 propriétés: contraste (variations locales), 
                      corrélation (dépendances linéaires), énergie (uniformité), homogénéité (similarité locale). 
                      Quantifie à 64 niveaux pour optimiser la vitesse.
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/50 p-3">
                    <h5 className="text-sm font-semibold text-foreground mb-1">LBP (Local Binary Pattern)</h5>
                    <p className="text-xs text-muted-foreground">
                      Compare chaque pixel avec ses 24 voisins (P=24, R=3). Crée un code binaire représentant 
                      la texture locale. Invariant aux changements d'illumination. Produit un histogramme de 26 bins 
                      pour caractériser les motifs de texture.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Extraction Info */}
            {result.meta?.feature_count && (
              <div className="mt-6 rounded-[2rem] border border-border/50 bg-white p-6">
                <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-secondary" />
                  Extraction de Caractéristiques (ML Model)
                </h3>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl bg-primary/5 p-3">
                    <div className="text-2xl font-bold text-primary">{result.meta.feature_count}</div>
                    <div className="text-xs text-muted-foreground">Caractéristiques totales</div>
                  </div>
                  <div className="rounded-xl bg-secondary/5 p-3">
                    <div className="text-2xl font-bold text-secondary">78</div>
                    <div className="text-xs text-muted-foreground">Couleur (RGB + HSV)</div>
                  </div>
                  <div className="rounded-xl bg-primary/5 p-3">
                    <div className="text-2xl font-bold text-primary">40</div>
                    <div className="text-xs text-muted-foreground">Texture + Forme</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Le modèle ML extrait 118 caractéristiques: 78 de couleur (histogrammes RGB/HSV, statistiques), 
                  34 de texture (GLCM, LBP), et 6 de forme (aire, périmètre, circularité, etc.).
                </p>
                
                {/* Preprocessing Pipeline */}
                <div className="mt-4 pt-4 border-t border-border/30">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Pipeline de Prétraitement</h4>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                      <span className="font-bold">1</span> Resize 224×224
                    </div>
                    <div className="flex items-center gap-2 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                      <span className="font-bold">2</span> RGB → HSV
                    </div>
                    <div className="flex items-center gap-2 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                      <span className="font-bold">3</span> CLAHE (V channel)
                    </div>
                    <div className="flex items-center gap-2 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                      <span className="font-bold">4</span> Gaussian Blur
                    </div>
                    <div className="flex items-center gap-2 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                      <span className="font-bold">5</span> Normalize [0,1]
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Chaque image passe par 5 étapes de prétraitement avant l'extraction de caractéristiques, 
                    garantissant une cohérence entre l'entraînement et l'inférence.
                  </p>
                </div>
              </div>
            )}
          </section>
        ) : null}
      </div>
    </main>
  );
}

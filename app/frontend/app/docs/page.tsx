"use client";

import { motion } from "framer-motion";
import { Activity, ArrowLeft, BookOpen, Brain, Cpu, Eye, Layers, Sparkles, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";

export default function Documentation() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="organic-blob absolute -left-24 top-12 h-72 w-72 bg-primary/20 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-[35%_65%_70%_30%_/_40%_30%_70%_60%] bg-secondary/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-semibold">Back to Classifier</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2.5rem] border border-border/50 bg-white/65 p-8 text-center shadow-soft backdrop-blur-md"
          >
            <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-3 text-5xl text-foreground">
              Technical <span className="text-primary">Documentation</span>
            </h1>
            <p className="mx-auto max-w-3xl text-base text-muted-foreground">
              Comprehensive guide to the plant disease detection system, model architectures, and performance analysis
            </p>
          </motion.div>
        </header>

        {/* Model Comparison Section */}
        <section className="mb-8 rounded-[2.5rem] border border-border/50 bg-white/90 p-8 shadow-soft">
          <div className="mb-6 flex items-center gap-3">
            <Layers className="h-6 w-6 text-primary" />
            <h2 className="text-3xl text-foreground">Model Comparison</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Deep Learning Pretrained */}
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-primary/10 p-6">
              <div className="mb-4 flex items-center gap-3">
                <Brain className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-xl font-bold text-foreground">Deep Learning (Pretrained)</h3>
                  <p className="text-sm text-muted-foreground">ResNet18 with ImageNet weights</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Architecture</h4>
                  <p className="text-xs text-muted-foreground">
                    ResNet18 (18 layers) with residual connections. Pre-trained on ImageNet (1.2M images, 1000 classes).
                    Final fully-connected layer fine-tuned for 15 plant disease classes.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Advantages</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>✓ Transfer learning from ImageNet provides robust feature extraction</li>
                    <li>✓ Excellent at recognizing complex spatial patterns and textures</li>
                    <li>✓ High accuracy on diverse disease manifestations</li>
                    <li>✓ Residual connections prevent vanishing gradients</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Best For</h4>
                  <p className="text-xs text-muted-foreground">
                    Complex lesion patterns, subtle texture variations, and cases requiring deep hierarchical feature learning
                  </p>
                </div>
                
                <div className="pt-3 border-t border-border/30">
                  <div className="flex gap-2">
                    <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                      11M parameters
                    </span>
                    <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                      ~98% accuracy
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deep Learning Scratch */}
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-secondary/5 to-secondary/10 p-6">
              <div className="mb-4 flex items-center gap-3">
                <Cpu className="h-8 w-8 text-secondary" />
                <div>
                  <h3 className="text-xl font-bold text-foreground">Deep Learning (Scratch)</h3>
                  <p className="text-sm text-muted-foreground">Custom CNN trained from scratch</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Architecture</h4>
                  <p className="text-xs text-muted-foreground">
                    4-layer CNN: Conv(32) → Conv(64) → Conv(128) → Conv(256) with BatchNorm, MaxPool, and Dropout.
                    Trained exclusively on PlantVillage dataset without pre-training.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Advantages</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>✓ Lightweight and fast inference (~0.5M parameters)</li>
                    <li>✓ Specialized for plant disease patterns</li>
                    <li>✓ No dependency on external pre-trained weights</li>
                    <li>✓ Easier to deploy on edge devices</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Best For</h4>
                  <p className="text-xs text-muted-foreground">
                    Resource-constrained environments, real-time mobile applications, and scenarios requiring fast inference
                  </p>
                </div>
                
                <div className="pt-3 border-t border-border/30">
                  <div className="flex gap-2">
                    <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold text-secondary">
                      0.5M parameters
                    </span>
                    <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold text-secondary">
                      ~88% accuracy
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Machine Learning */}
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
              <div className="mb-4 flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-xl font-bold text-foreground">Machine Learning (Full)</h3>
                  <p className="text-sm text-muted-foreground">Handcrafted features + classifier</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Feature Engineering</h4>
                  <p className="text-xs text-muted-foreground">
                    118 handcrafted features: 78 color (RGB/HSV histograms + statistics), 34 texture (GLCM + LBP), 
                    6 shape (area, circularity, solidity, etc.). Trained with Random Forest/SVM.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Advantages</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>✓ Interpretable features (color, texture, shape)</li>
                    <li>✓ Works well with limited training data</li>
                    <li>✓ Fast training and inference</li>
                    <li>✓ Explainable predictions</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Best For</h4>
                  <p className="text-xs text-muted-foreground">
                    Scenarios requiring feature interpretability, limited computational resources, or when domain knowledge guides feature selection
                  </p>
                </div>
                
                <div className="pt-3 border-t border-border/30">
                  <div className="flex gap-2">
                    <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                      118 features
                    </span>
                    <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold text-secondary">
                      ~97% accuracy
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Machine Learning PCA */}
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-secondary/5 to-primary/5 p-6">
              <div className="mb-4 flex items-center gap-3">
                <Activity className="h-8 w-8 text-secondary" />
                <div>
                  <h3 className="text-xl font-bold text-foreground">ML + PCA (Optimized)</h3>
                  <p className="text-sm text-muted-foreground">Dimensionality reduction</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">PCA Transformation</h4>
                  <p className="text-xs text-muted-foreground">
                    Principal Component Analysis reduces 118 features to ~40 components while retaining 95% of variance.
                    Eliminates redundancy and noise, improving generalization.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Advantages</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>✓ 65% faster inference (fewer features to process)</li>
                    <li>✓ Reduces overfitting by removing noise</li>
                    <li>✓ Mitigates curse of dimensionality</li>
                    <li>✓ Minimal accuracy loss (~1-2%)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Best For</h4>
                  <p className="text-xs text-muted-foreground">
                    Production environments requiring fast inference, mobile/edge deployment, or when computational efficiency is critical
                  </p>
                </div>
                
                <div className="pt-3 border-t border-border/30">
                  <div className="flex gap-2">
                    <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold text-secondary">
                      41 components
                    </span>
                    <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                      ~90% accuracy
                    </span>
                    <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold text-secondary">
                      65% faster
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Preprocessing Pipeline */}
        <section className="mb-8 rounded-[2.5rem] border border-border/50 bg-white/90 p-8 shadow-soft">
          <div className="mb-6 flex items-center gap-3">
            <Eye className="h-6 w-6 text-primary" />
            <h2 className="text-3xl text-foreground">Preprocessing Pipeline</h2>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              All models use a unified 5-step preprocessing pipeline to ensure consistency between training and inference:
            </p>

            <div className="grid gap-4 md:grid-cols-5">
              {[
                { step: 1, title: "Resize", desc: "Standardize to 224×224 pixels using area interpolation" },
                { step: 2, title: "RGB → HSV", desc: "Convert to Hue-Saturation-Value color space" },
                { step: 3, title: "CLAHE", desc: "Contrast Limited Adaptive Histogram Equalization on V channel" },
                { step: 4, title: "Gaussian Blur", desc: "5×5 kernel to reduce noise while preserving edges" },
                { step: 5, title: "Normalize", desc: "Scale pixel values to [0, 1] range" },
              ].map((item) => (
                <div key={item.step} className="rounded-xl border border-border/50 bg-gradient-to-br from-primary/5 to-white p-4">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-sm font-bold text-primary">
                    {item.step}
                  </div>
                  <h4 className="mb-1 text-sm font-semibold text-foreground">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Extraction */}
        <section className="mb-8 rounded-[2.5rem] border border-border/50 bg-white/90 p-8 shadow-soft">
          <div className="mb-6 flex items-center gap-3">
            <Zap className="h-6 w-6 text-primary" />
            <h2 className="text-3xl text-foreground">Feature Extraction (ML Models)</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border/50 bg-primary/5 p-6">
              <h3 className="mb-3 text-lg font-bold text-foreground">Color Features (78)</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>• RGB Histogram: 16 bins × 3 channels = 48 values</li>
                <li>• RGB Statistics: mean + std per channel = 6 values</li>
                <li>• HSV H-channel Histogram: 18 bins</li>
                <li>• HSV Statistics: mean + std per channel = 6 values</li>
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                Captures color distribution and variations indicative of disease-related discoloration
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-secondary/5 p-6">
              <h3 className="mb-3 text-lg font-bold text-foreground">Texture Features (34)</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>• GLCM: 4 properties (contrast, correlation, energy, homogeneity) × 2 stats = 8 values</li>
                <li>• LBP: Uniform pattern histogram with P=24, R=3 = 26 bins</li>
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                Quantifies surface texture patterns like spots, lesions, and necrotic tissue
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-primary/5 p-6">
              <h3 className="mb-3 text-lg font-bold text-foreground">Shape Features (6)</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>• Area: Total leaf pixel count</li>
                <li>• Perimeter: Boundary length</li>
                <li>• Circularity: 4π × area / perimeter²</li>
                <li>• Aspect Ratio: width / height</li>
                <li>• Solidity: area / convex hull area</li>
                <li>• Extent: area / bounding box area</li>
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                Describes leaf morphology and deformation caused by disease
              </p>
            </div>
          </div>
        </section>

        {/* Performance Comparison */}
        <section className="mb-8 rounded-[2.5rem] border border-border/50 bg-white/90 p-8 shadow-soft">
          <div className="mb-6 flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-3xl text-foreground">Performance Metrics</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="pb-3 text-left font-semibold text-foreground">Model</th>
                  <th className="pb-3 text-center font-semibold text-foreground">Accuracy</th>
                  <th className="pb-3 text-center font-semibold text-foreground">F1-Score</th>
                  <th className="pb-3 text-center font-semibold text-foreground">Inference Time</th>
                  <th className="pb-3 text-center font-semibold text-foreground">Model Size</th>
                  <th className="pb-3 text-left font-semibold text-foreground">Trade-offs</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                <tr className="border-b border-border/30">
                  <td className="py-3 font-semibold text-foreground">DL Pretrained</td>
                  <td className="py-3 text-center text-primary font-bold">~98%</td>
                  <td className="py-3 text-center text-primary font-bold">~0.97</td>
                  <td className="py-3 text-center text-muted-foreground">~50ms</td>
                  <td className="py-3 text-center text-muted-foreground">~44MB</td>
                  <td className="py-3 text-muted-foreground">Highest accuracy but largest model</td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="py-3 font-semibold text-foreground">DL Scratch</td>
                  <td className="py-3 text-center text-secondary font-bold">~88%</td>
                  <td className="py-3 text-center text-secondary font-bold">~0.87</td>
                  <td className="py-3 text-center text-muted-foreground">~15ms</td>
                  <td className="py-3 text-center text-muted-foreground">~2MB</td>
                  <td className="py-3 text-muted-foreground">Fast and lightweight, good accuracy</td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="py-3 font-semibold text-foreground">ML (Full)</td>
                  <td className="py-3 text-center text-primary font-bold">~99%</td>
                  <td className="py-3 text-center text-primary font-bold">~0.99</td>
                  <td className="py-3 text-center text-muted-foreground">~10ms</td>
                  <td className="py-3 text-center text-muted-foreground">~5MB</td>
                  <td className="py-3 text-muted-foreground">Interpretable, fast, excellent accuracy</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-foreground">ML + PCA (K=15)</td>
                  <td className="py-3 text-center text-secondary font-bold">~92%</td>
                  <td className="py-3 text-center text-secondary font-bold">~0.92</td>
                  <td className="py-3 text-center text-primary font-bold">~3ms</td>
                  <td className="py-3 text-center text-muted-foreground">~3MB</td>
                  <td className="py-3 text-muted-foreground">Fastest inference, good accuracy</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
            <h4 className="mb-2 text-sm font-semibold text-foreground">Key Insights</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• ML (Full) achieves highest accuracy (99%) with interpretable handcrafted features</li>
              <li>• DL Pretrained offers excellent accuracy (98%) with deep feature learning</li>
              <li>• ML + PCA (K=15) provides 3× faster inference with 92% accuracy (7% drop from full ML)</li>
              <li>• DL Scratch balances accuracy (88%) and efficiency, ideal for mobile deployment</li>
              <li>• All models achieve &gt;88% accuracy, suitable for production use</li>
            </ul>
          </div>
        </section>

        {/* Why PCA is Better */}
        <section className="mb-8 rounded-[2.5rem] border border-border/50 bg-gradient-to-br from-primary/10 to-secondary/10 p-8 shadow-soft">
          <div className="mb-6 flex items-center gap-3">
            <Activity className="h-6 w-6 text-primary" />
            <h2 className="text-3xl text-foreground">Why PCA Improves Performance</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border/50 bg-white p-6">
              <h3 className="mb-3 text-lg font-bold text-foreground">Benefits of Dimensionality Reduction</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary">✓</span>
                  <div>
                    <strong className="text-foreground">Removes Redundancy:</strong> Many of the 118 features are correlated. 
                    PCA identifies and eliminates redundant information.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">✓</span>
                  <div>
                    <strong className="text-foreground">Noise Reduction:</strong> By keeping only components with high variance, 
                    PCA filters out noise and focuses on signal.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">✓</span>
                  <div>
                    <strong className="text-foreground">Curse of Dimensionality:</strong> With 15 classes and 41k samples, 
                    reducing from 118 to 40 features improves generalization.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">✓</span>
                  <div>
                    <strong className="text-foreground">Computational Efficiency:</strong> Fewer features mean faster matrix operations, 
                    especially beneficial for distance-based algorithms (KNN, SVM).
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/50 bg-white p-6">
              <h3 className="mb-3 text-lg font-bold text-foreground">95% Variance Threshold</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                We chose 95% explained variance as the optimal balance:
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-secondary">•</span>
                  <div>
                    <strong className="text-foreground">90% variance:</strong> Too aggressive, loses important patterns (10% information loss)
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">✓</span>
                  <div>
                    <strong className="text-foreground">95% variance:</strong> Sweet spot - retains most information while achieving 
                    significant dimensionality reduction (~65%)
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-secondary">•</span>
                  <div>
                    <strong className="text-foreground">99% variance:</strong> Too conservative, keeps ~73 components, 
                    minimal computational benefit
                  </div>
                </li>
              </ul>
              <div className="mt-4 rounded-lg bg-primary/10 p-3">
                <p className="text-xs text-foreground">
                  <strong>Result:</strong> 95% PCA reduces features from 118 → 41 (65% reduction) with 7% accuracy loss 
                  (99% → 92%), while providing 3× faster inference. KNN with K=15 neighbors optimizes the trade-off.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground">
          <p>Plant Health Studio © 2024 - Advanced Plant Disease Detection System</p>
        </footer>
      </div>
    </main>
  );
}

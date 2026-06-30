// Extended AI Training domain content for detail pages
// Combines existing aiTraining.js data with deeper narrative, training history,
// architecture details, and open-source credits

export const aiTrainingDetails = [
  {
    id: "medical",
    title: "Medical Imaging",
    tagline: "DICOM/NIfTI → Classification",
    icon: "🩺",
    color: "from-blue-500 to-cyan-500",
    description:
      "A medical imaging preprocessing and classification pipeline built on SimpleITK, pydicom, and MONAI. Handles DICOM/NIfTI ingestion, HU windowing, resampling, and normalization. Demo model is a U-Net classifier trained on MedNIST.",
    problem: {
      lead: "Medical images arrive as DICOM — a format ML models can't consume directly. Raw data must be decoded, normalized, resampled, and cropped before a network can see it.",
      points: [
        "DICOM packages pixel data alongside patient metadata, acquisition parameters, and spatial geometry",
        "Modalities (CT, MRI, X-ray) use different intensity scales — a pipeline built for one can fail silently on another",
        "Spatial resolution and orientation vary by scanner, so resampling to a common grid is required",
        "Without robust preprocessing, downstream model accuracy is unreliable",
      ],
    },
    approach: {
      lead: "SimpleITK + pydicom handle DICOM ingestion and geometric preprocessing; MONAI's U-Net classifies the result.",
      points: [
        "SimpleITK reads DICOM series natively and provides battle-tested B-spline resampling to 1mm isotropic",
        "pydicom supplements where SimpleITK's series reader needs raw tag access",
        "MONAI's U-Net encoder extracts hierarchical spatial features; a classification head maps to 6 radiograph classes",
        "Trained on a 2,000-image MedNIST subset for 5 epochs on CPU → 99.3% validation accuracy",
      ],
    },
    pipeline: [
      { step: "Load", tool: "pydicom / SimpleITK", detail: "DICOM series or NIfTI volume" },
      { step: "Normalize", tool: "SimpleITK", detail: "MONOCHROME1→2, HU windowing (-1024 to 1600)" },
      { step: "Resample", tool: "SimpleITK", detail: "B-spline to 1mm isotropic" },
      { step: "Crop/Pad", tool: "NumPy", detail: "Center crop to 64×64×64" },
      { step: "Classify", tool: "MONAI U-Net", detail: "6-class radiograph classification" },
    ],
    codeSnippet: `from domains.medical.pipeline import preprocess_2d_image
from domains.medical.infer import predict

# Preprocess a radiograph
arr = preprocess_2d_image("chest_xray.png", size=64)

# Run inference
result = predict("chest_xray.png")
# -> {'predicted_class': 'CXR', 'confidence': 0.998}`,
    metrics: [
      { label: "Val Accuracy", value: "99.3%" },
      { label: "Classes", value: "6" },
      { label: "Dataset", value: "MedNIST" },
      { label: "Train Time", value: "~3 min" },
    ],
    techStack: ["SimpleITK", "pydicom", "MONAI", "PyTorch", "Gradio"],
    demoUrl: "https://fjkiani-ai-medical.hf.space",
    repoUrl: "https://github.com/fjkiani/ai-training/tree/main/domains/medical",
    inputType: "Radiograph (PNG/JPG)",
    outputType: "Predicted class + confidence",
    resultImages: [
      { src: "/ai-training-results/showcase_medical_Hand.png", caption: "Hand → Hand (100%)" },
      { src: "/ai-training-results/showcase_medical_HeadCT.png", caption: "HeadCT → HeadCT (99.7%)" },
      { src: "/ai-training-results/showcase_medical_BreastMRI.png", caption: "BreastMRI → BreastMRI (99.9%)" },
      { src: "/ai-training-results/showcase_medical_CXR.png", caption: "CXR → CXR (96.7%)" },
    ],
    trainingHistory: [
      { epoch: 1, train_loss: "0.326", train_acc: "89.7%", val_loss: "3.572", val_acc: "42.3%" },
      { epoch: 2, train_loss: "0.070", train_acc: "98.5%", val_loss: "0.012", val_acc: "99.3%" },
      { epoch: 3, train_loss: "0.075", train_acc: "98.1%", val_loss: "0.205", val_acc: "93.7%" },
      { epoch: 4, train_loss: "0.035", train_acc: "99.2%", val_loss: "1.228", val_acc: "75.7%" },
      { epoch: 5, train_loss: "0.069", train_acc: "98.4%", val_loss: "0.245", val_acc: "91.0%" },
    ],
    modelArchitecture: {
      type: "U-Net encoder + classification head (SimpleUNetClassifier)",
      layers: "3 downsample blocks: 32→64→128→256 features, bottleneck at 256",
      optimizer: "Adam, learning rate 1e-3",
      loss: "CrossEntropyLoss",
      parameters: "~500K trainable parameters",
      notes: "Designed for small 64×64 grayscale images and CPU training. Global average pooling reduces spatial dimensions before the linear classifier.",
    },
    technicalDetails: {
      dependencies: [
        { name: "SimpleITK", version: "≥2.3", purpose: "DICOM/NIfTI I/O, resampling, geometry" },
        { name: "pydicom", version: "≥2.4", purpose: "DICOM tag parsing, pixel decoding" },
        { name: "MONAI", version: "≥1.3", purpose: "U-Net model, MedNIST dataset, transforms" },
        { name: "PyTorch", version: "≥2.1", purpose: "Deep learning framework" },
        { name: "Gradio", version: "≥4.0", purpose: "Web demo interface" },
      ],
      trainingConfig: {
        dataset: "MONAI MedNIST (47,164 radiographs)",
        subset: "2,000 images (balanced across 6 classes)",
        epochs: 5,
        batchSize: 32,
        hardware: "CPU (no GPU required)",
        image_size: "64×64 grayscale",
      },
      codeSnippets: [
        {
          title: "Preprocessing Pipeline",
          code: `# Load DICOM series or NIfTI
img = load_volume("patient_scan/")

# HU windowing: clip to clinical range, normalize to [0,1]
arr = hu_window(arr, window=(-1024, 1600))

# Resample to 1mm isotropic spacing (B-spline)
img = resample_volume(img, target_spacing=(1.0, 1.0, 1.0))

# Center crop or zero-pad to 64×64×64
arr = center_crop_or_pad(arr, size=(64, 64, 64))`,
        },
        {
          title: "Training",
          code: `model = build_model(device="cpu")
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

for epoch in range(5):
    for imgs, labels in train_loader:
        out = model(imgs)
        loss = criterion(out, labels)
        loss.backward()
        optimizer.step()`,
        },
        {
          title: "Inference",
          code: `result = predict("chest_xray.png")
# -> {
#   'predicted_class': 'CXR',
#   'confidence': 0.998,
#   'probabilities': {'AbdomenCT': 0.001, ...}
# }`,
        },
      ],
    },
    credits: [
      { name: "DH82/medip", url: "https://github.com/DH82/medip", license: "MIT", usage: "DICOM preprocessing pipeline structure" },
      { name: "Project MONAI", url: "https://github.com/Project-MONAI/MONAI", license: "Apache-2.0", usage: "U-Net model, transforms, MedNIST dataset" },
    ],
  },
  {
    id: "geospatial",
    title: "Geospatial",
    tagline: "GeoTIFF → Segmentation",
    icon: "🗺️",
    color: "from-green-500 to-emerald-500",
    description:
      "A geospatial preprocessing and segmentation pipeline built on rasterio, geopandas, and segmentation-models-pytorch. Handles GeoTIFF ingestion, reprojection, normalization, tiling, and vector label rasterization. Demo model is a U-Net (ResNet18) for land/water segmentation.",
    problem: {
      lead: "Satellite scenes are gigabyte GeoTIFFs spanning multiple CRSes and resolutions — too large to feed a model directly.",
      points: [
        "A single scene can be 10,000×10,000 pixels across 4+ spectral bands",
        "Reprojection to a common CRS is needed before tiles align across scenes",
        "Vector annotations (GeoJSON, Shapefile) must be rasterized into masks aligned to tile geometry",
        "Edge cases — nodata pixels, tile boundaries, train/test spatial leakage — are all geospatial-specific",
      ],
    },
    approach: {
      lead: "rasterio handles raster I/O and reprojection; geopandas rasterizes vector labels; a U-Net segments the tiles.",
      points: [
        "rasterio reads GeoTIFFs with windowed access and handles CRS transformations efficiently",
        "geopandas + shapely rasterize polygon labels into binary masks aligned with the image grid",
        "segmentation-models-pytorch provides a U-Net (ResNet18 encoder) — lightweight enough for CPU training",
        "Synthetic land/water dataset reaches 100% IoU; same pipeline works on real GeoTIFFs by swapping data sources",
      ],
    },
    pipeline: [
      { step: "Load", tool: "rasterio", detail: "GeoTIFF (any CRS, multi-band)" },
      { step: "Reproject", tool: "rasterio", detail: "To EPSG:3857 if needed" },
      { step: "Normalize", tool: "NumPy", detail: "Per-band percentile (2-98%) to [0,1]" },
      { step: "Tile", tool: "rasterio", detail: "256×256 patches, skip nodata" },
      { step: "Rasterize", tool: "geopandas", detail: "Vector labels → binary masks" },
      { step: "Segment", tool: "U-Net (ResNet18)", detail: "Land/water binary segmentation" },
    ],
    codeSnippet: `from domains.geospatial.pipeline import prepare_dataset
from domains.geospatial.infer import predict_tile

# Tile a GeoTIFF with labels
manifest = prepare_dataset(
    raster_path="satellite.tif",
    labels_path="labels.geojson",
    output_dir="data/prepared",
)

# Predict on a tile
mask = predict_tile(image_array)`,
    metrics: [
      { label: "Val IoU", value: "99.9%" },
      { label: "Tile Size", value: "256px" },
      { label: "Dataset", value: "Synthetic" },
      { label: "Train Time", value: "~10 min" },
    ],
    techStack: ["rasterio", "geopandas", "shapely", "SMP", "PyTorch", "Gradio"],
    demoUrl: "https://fjkiani-ai-geospatial.hf.space",
    repoUrl: "https://github.com/fjkiani/ai-training/tree/main/domains/geospatial",
    inputType: "Satellite tile (PNG/JPG)",
    outputType: "Land/water segmentation mask",
    resultImages: [
      { src: "/ai-training-results/showcase_geospatial_coastline_tile.png", caption: "Coastline tile → 49.9% land" },
      { src: "/ai-training-results/showcase_geospatial_island_tile.png", caption: "Island tile → 42.7% land" },
    ],
    trainingHistory: [
      { epoch: 1, train_loss: "0.091", val_loss: "0.029", val_iou: "99.5%" },
      { epoch: 2, train_loss: "0.011", val_loss: "0.008", val_iou: "99.9%" },
      { epoch: 3, train_loss: "0.006", val_loss: "0.005", val_iou: "99.96%" },
      { epoch: 5, train_loss: "0.003", val_loss: "0.002", val_iou: "99.98%" },
      { epoch: 10, train_loss: "0.001", val_loss: "0.001", val_iou: "100.0%" },
    ],
    modelArchitecture: {
      type: "U-Net with ResNet18 encoder (segmentation-models-pytorch)",
      layers: "ResNet18 encoder (5 stages) + U-Net decoder with skip connections",
      optimizer: "Adam, learning rate 1e-3",
      loss: "BCE Loss (binary cross-entropy)",
      parameters: "~14M (ResNet18 backbone)",
      notes: "Sigmoid activation on output for binary segmentation. Encoder weights initialized from scratch (no ImageNet pretraining) for the synthetic demo. On real data, pretrained encoder weights improve convergence.",
    },
    technicalDetails: {
      dependencies: [
        { name: "rasterio", version: "≥1.3", purpose: "GeoTIFF I/O, windowed reading, CRS" },
        { name: "geopandas", version: "≥0.13", purpose: "Vector data handling, label rasterization" },
        { name: "shapely", version: "≥2.0", purpose: "Geometry operations" },
        { name: "segmentation-models-pytorch", version: "≥0.3", purpose: "U-Net model with encoder" },
        { name: "GDAL", version: "≥3.6", purpose: "System library for rasterio (apt install)" },
      ],
      trainingConfig: {
        dataset: "Synthetic land/water tiles (500 tiles, 256×256, 3-band RGB)",
        epochs: 10,
        batchSize: 8,
        hardware: "CPU (no GPU required)",
        tile_size: "256×256 pixels",
      },
      codeSnippets: [
        {
          title: "Tiling a GeoTIFF",
          code: `# Open raster and generate tiles
src = rasterio.open("satellite.tif")
tiles = tile_raster(src, tile_size=256)

# For each tile: read, normalize, rasterize labels
for col_off, row_off in tiles:
    img = read_tile(src, col_off, row_off, 256)
    mask = rasterize_labels(src, "labels.geojson",
                            col_off, row_off, 256)`,
        },
        {
          title: "Training",
          code: `model = Unet(encoder_name="resnet18", in_channels=3,
              classes=1, activation="sigmoid")
criterion = nn.BCELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

for epoch in range(10):
    for imgs, masks in train_loader:
        out = model(imgs)
        loss = criterion(out, masks)
        loss.backward()
        optimizer.step()`,
        },
        {
          title: "Inference",
          code: `mask = predict_tile(image_array)
# Returns: (256, 256) uint8 binary mask
# 1 = land, 0 = water`,
        },
      ],
    },
    credits: [
      { name: "opengeos/geoai", url: "https://github.com/opengeos/geoai", license: "MIT", usage: "Tiling and rasterization concepts" },
      { name: "segmentation-models-pytorch", url: "https://github.com/qubvel-org/segmentation_models.pytorch", license: "MIT", usage: "U-Net model architecture" },
    ],
  },
  {
    id: "audio",
    title: "Audio",
    tagline: "WAV/MP3 → Classification",
    icon: "🔊",
    color: "from-purple-500 to-violet-500",
    description:
      "An audio preprocessing and classification pipeline built on librosa and scikit-learn. Handles audio loading, resampling, feature extraction (MFCC, mel-spectrogram, chroma, spectral contrast, tonnetz), and aggregation. Demo model is a Random Forest trained on ESC-50 (50 environmental sound classes).",
    problem: {
      lead: "Raw audio is high-dimensional and varies wildly by format, sample rate, and channel count — classification needs a compact, normalized feature representation.",
      points: [
        "Inputs span WAV/MP3/FLAC, 8–48 kHz sample rates, and mono/stereo configurations",
        "Different feature families capture different signal aspects: MFCC (timbre), mel-spectrogram (time-frequency), chroma (pitch), spectral contrast (dynamics), tonnetz (harmony)",
        "A neural network on raw waveforms is impractical for short clips; compact features train faster and generalize",
        "Choosing the right feature mix is task-dependent — environmental sounds need different features than speech",
      ],
    },
    approach: {
      lead: "librosa extracts five feature types per clip; a Random Forest classifies the 130-dim aggregated vector across 50 ESC-50 classes.",
      points: [
        "librosa handles loading, 22.05 kHz resampling, and provides all feature extractors used",
        "5 feature families (MFCC, mel-spec, chroma, contrast, tonnetz) aggregated by mean+std → 130-dim vector",
        "Random Forest classifier is fast, interpretable, and trains in seconds on CPU with no normalization tricks",
        "Trained on ESC-50 (2,000 clips, 50 classes) → 60.3% test accuracy (random chance is 2%); CNN-on-mel-spec option included for higher accuracy",
      ],
    },
    pipeline: [
      { step: "Load", tool: "librosa", detail: "WAV/MP3 → 22050 Hz mono" },
      { step: "Extract", tool: "librosa", detail: "MFCC(40), mel-spec(128), chroma(12), contrast(7), tonnetz(6)" },
      { step: "Aggregate", tool: "NumPy", detail: "Mean + std → 130-dim vector" },
      { step: "Normalize", tool: "scikit-learn", detail: "Z-score (train stats)" },
      { step: "Classify", tool: "Random Forest", detail: "50 environmental sound classes" },
    ],
    codeSnippet: `from domains.audio.pipeline import get_feature_vector
from domains.audio.infer import predict

# Extract features
features = get_feature_vector("sound.wav")

# Classify
result = predict("sound.wav")
# -> {'predicted_class': 'dog', 'confidence': 0.85}`,
    metrics: [
      { label: "Test Accuracy", value: "60.3%" },
      { label: "Classes", value: "50" },
      { label: "Features", value: "130-dim" },
      { label: "Dataset", value: "ESC-50" },
    ],
    techStack: ["librosa", "soundfile", "scikit-learn", "Gradio", "matplotlib"],
    demoUrl: "https://fjkiani-ai-audio.hf.space",
    demoPaused: true,
    repoUrl: "https://github.com/fjkiani/ai-training/tree/main/domains/audio",
    inputType: "Audio file (WAV/MP3)",
    outputType: "Class prediction + spectrogram",
    resultImages: [
      { src: "/ai-training-results/showcase_audio_helicopter.png", caption: "Helicopter → helicopter (72.5%)" },
      { src: "/ai-training-results/showcase_audio_siren.png", caption: "Siren → siren (75.5%)" },
      { src: "/ai-training-results/showcase_audio_rooster.png", caption: "Rooster → rooster (70.0%)" },
      { src: "/ai-training-results/showcase_audio_dog.png", caption: "Dog → dog (65.5%)" },
      { src: "/ai-training-results/showcase_audio_crying_baby.png", caption: "Crying baby → crying_baby (60.0%)" },
      { src: "/ai-training-results/showcase_audio_sea_waves.png", caption: "Sea waves → sea_waves (53.5%)" },
    ],
    trainingHistory: [
      { note: "Random Forest — no epoch-based training. Model trains in seconds on CPU." },
      { train_samples: "1,400", val_samples: "300", test_samples: "300", val_acc: "60.0%", test_acc: "60.3%" },
    ],
    modelArchitecture: {
      type: "Random Forest Classifier (scikit-learn)",
      trees: "200 estimators",
      features: "130-dimensional (MFCC + chroma + spectral contrast + tonnetz, mean+std)",
      class_weight: "balanced (handles class imbalance)",
      parameters: "N/A (tree-based, no gradient descent)",
      notes: "A small CNN on mel-spectrograms is included as an optional alternative in the codebase. The RF was chosen as the primary demo for speed and interpretability.",
    },
    technicalDetails: {
      dependencies: [
        { name: "librosa", version: "≥0.10", purpose: "Audio loading, feature extraction" },
        { name: "soundfile", version: "≥0.12", purpose: "Audio I/O (WAV/FLAC)" },
        { name: "scikit-learn", version: "≥1.3", purpose: "Random Forest classifier" },
        { name: "pydub", version: "≥0.25", purpose: "MP3 handling" },
        { name: "ffmpeg", version: "≥5.0", purpose: "System library for audio decoding" },
      ],
      trainingConfig: {
        dataset: "ESC-50 (2,000 environmental sound clips, 50 classes)",
        split: "70% train / 15% val / 15% test (1,400 / 300 / 300)",
        feature_dim: "130 (40 MFCC + 12 chroma + 7 contrast + 6 tonnetz, ×2 for mean+std)",
        hardware: "CPU (trains in seconds)",
        sample_rate: "22050 Hz, mono",
      },
      codeSnippets: [
        {
          title: "Feature Extraction",
          code: `# Load and extract all features
y, sr = librosa.load("sound.wav", sr=22050, mono=True)

mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
mel_spec = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128)
chroma = librosa.feature.chroma_stft(S=np.abs(librosa.stft(y)), sr=sr)
contrast = librosa.feature.spectral_contrast(S=np.abs(librosa.stft(y)), sr=sr)
tonnetz = librosa.feature.tonnetz(y=librosa.effects.harmonic(y), sr=sr)

# Aggregate: mean + std per coefficient → 130-dim vector
features = np.concatenate([
    np.mean(mfcc, axis=1), np.std(mfcc, axis=1),
    np.mean(chroma, axis=1), np.std(chroma, axis=1),
    np.mean(contrast, axis=1), np.std(contrast, axis=1),
    np.mean(tonnetz, axis=1), np.std(tonnetz, axis=1),
])`,
        },
        {
          title: "Training",
          code: `model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced",
    n_jobs=-1,
)
model.fit(X_train, y_train)
# Trains in seconds on CPU`,
        },
        {
          title: "Inference",
          code: `result = predict("dog_bark.wav")
# -> {
#   'predicted_class': 'dog',
#   'confidence': 0.655,
#   'top5': [('dog', 0.655), ('glass_breaking', 0.095), ...]
# }`,
        },
      ],
    },
    credits: [
      { name: "danilodsp/AFX", url: "https://github.com/danilodsp/AFX", license: "MIT", usage: "Feature extraction approach" },
      { name: "MaxHilsdorf/SLAPP", url: "https://github.com/MaxHilsdorf/single_label_audio_processing_pipeline", license: "MIT", usage: "Dataset preparation concepts" },
      { name: "ESC-50", url: "https://github.com/karoldvl/ESC-50", license: "CC-BY-NC", usage: "Environmental sound dataset" },
    ],
  },
  {
    id: "video",
    title: "Video",
    tagline: "MP4 → Scene Detection + Tags",
    icon: "🎬",
    color: "from-orange-500 to-red-500",
    description:
      "A video preprocessing pipeline built on PySceneDetect, OpenCV, and HuggingFace Transformers (CLIP). Detects scene boundaries, extracts representative keyframes, deduplicates near-identical frames, and performs zero-shot classification using CLIP. No training required — CLIP's pretrained weights provide zero-shot tagging.",
    problem: {
      lead: "Videos are too dense to process frame-by-frame, and labeled training data for tagging is expensive — you need scene-aware sampling plus a label-free way to describe content.",
      points: [
        "A 10-minute clip at 30fps is 18,000 frames — processing every one is wasteful",
        "Scene boundaries (where content shifts meaningfully) matter more than uniform sampling",
        "Near-identical keyframes between similar shots add noise without information",
        "Training a custom classifier needs labeled data; zero-shot avoids that bottleneck entirely",
      ],
    },
    approach: {
      lead: "PySceneDetect finds scene boundaries, OpenCV samples keyframes, pHash deduplicates them, and CLIP zero-shot-tags each scene — no training required.",
      points: [
        "PySceneDetect ContentDetector (threshold 27) flags frames where pixel content shifts meaningfully",
        "OpenCV grabs the middle frame of each detected scene as the representative keyframe",
        "Perceptual hash (pHash, 0.9 similarity threshold) removes near-identical keyframes",
        "CLIP ViT-Base-Patch32 returns probabilities for 10 candidate labels (outdoor, indoor, person, vehicle, landscape, building, animal, text, food, sky)",
      ],
    },
    pipeline: [
      { step: "Probe", tool: "ffmpeg", detail: "Video metadata, FPS, resolution" },
      { step: "Detect Scenes", tool: "PySceneDetect", detail: "ContentDetector (threshold 27)" },
      { step: "Extract", tool: "OpenCV", detail: "Middle keyframe per scene" },
      { step: "Dedup", tool: "imagehash", detail: "pHash similarity > 0.9 removed" },
      { step: "Tag", tool: "CLIP (zero-shot)", detail: "10 candidate labels, top-5 per frame" },
    ],
    codeSnippet: `from domains.video.infer import analyze_video

# Process a video end-to-end
manifest = analyze_video("video.mp4")
# -> {n_scenes: 12, keyframes: [...], classifications: [...]}

# Custom labels
manifest = analyze_video(
    "video.mp4",
    candidate_labels=["ocean", "forest", "city"],
)`,
    metrics: [
      { label: "Approach", value: "Zero-shot" },
      { label: "Model", value: "CLIP ViT-B/32" },
      { label: "Labels", value: "10 default" },
      { label: "Training", value: "None needed" },
    ],
    techStack: ["PySceneDetect", "OpenCV", "Transformers", "CLIP", "Gradio"],
    demoUrl: "https://fjkiani-ai-video.hf.space",
    repoUrl: "https://github.com/fjkiani/ai-training/tree/main/domains/video",
    inputType: "Video (MP4)",
    outputType: "Scene list + keyframes + CLIP tags",
    resultImages: [
      { src: "/ai-training-results/showcase_video_demo_scenes.png", caption: "4 scenes detected: landscape (40.8%), text (31.9%), sky (97.7%), text (55.5%)" },
    ],
    trainingHistory: [
      { note: "Zero-shot approach — no training required. CLIP uses pretrained weights from OpenAI." },
      { model: "CLIP ViT-Base-Patch32", parameters: "~151M", pretrained_on: "400M image-text pairs" },
    ],
    modelArchitecture: {
      type: "CLIP ViT-Base-Patch32 (zero-shot, no training)",
      encoder: "Vision Transformer (ViT-B/32) for images + Text Transformer for labels",
      parameters: "~151M (pretrained, frozen)",
      loss: "N/A (inference only, no training)",
      notes: "CLIP maps images and text into a shared embedding space. Zero-shot classification works by computing cosine similarity between the image embedding and each label's text embedding, then applying softmax to get probabilities.",
    },
    technicalDetails: {
      dependencies: [
        { name: "PySceneDetect", version: "≥0.6", purpose: "Scene boundary detection" },
        { name: "OpenCV", version: "≥4.8", purpose: "Frame extraction, video I/O" },
        { name: "Transformers", version: "≥4.36", purpose: "CLIP model loading and inference" },
        { name: "imagehash", version: "≥4.3", purpose: "Perceptual hashing for dedup" },
        { name: "ffmpeg", version: "≥5.0", purpose: "Video probing and decoding" },
      ],
      trainingConfig: {
        approach: "Zero-shot (no training)",
        model: "openai/clip-vit-base-patch32",
        pretrained_on: "400M image-text pairs from the web",
        default_labels: "outdoor, indoor, person, vehicle, landscape, building, animal, text, food, sky",
        hardware: "CPU (model loads in ~20s, inference ~1s per frame)",
      },
      codeSnippets: [
        {
          title: "Scene Detection",
          code: `from scenedetect import detect, ContentDetector

# Detect scene boundaries
detector = ContentDetector(threshold=27, min_scene_len=15)
scenes = detect("video.mp4", detector, show_progress=False)
# Returns: [(start_time, end_time), ...] in seconds`,
        },
        {
          title: "Keyframe Extraction",
          code: `import cv2

cap = cv2.VideoCapture("video.mp4")
fps = cap.get(cv2.CAP_PROP_FPS)

for i, (start, end) in enumerate(scenes):
    mid_frame = int((start + end) / 2 * fps)
    cap.set(cv2.CAP_PROP_POS_FRAMES, mid_frame)
    ret, frame = cap.read()
    cv2.imwrite(f"keyframe_{i:03d}.png", frame)`,
        },
        {
          title: "CLIP Zero-Shot Classification",
          code: `from transformers import CLIPProcessor, CLIPModel

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

labels = ["outdoor", "indoor", "person", "vehicle", "landscape"]
inputs = processor(text=labels, images=image, return_tensors="pt")
outputs = model(**inputs)
probs = outputs.logits_per_image.softmax(dim=1)
# -> [0.41, 0.05, 0.02, 0.01, 0.48, ...]`,
        },
      ],
    },
    credits: [
      { name: "PySceneDetect", url: "https://github.com/Breakthrough/PySceneDetect", license: "BSD-3", usage: "Scene boundary detection" },
      { name: "HuggingFace Transformers", url: "https://github.com/huggingface/transformers", license: "Apache-2.0", usage: "CLIP model loading and inference" },
      { name: "OpenAI CLIP", url: "https://github.com/openai/CLIP", license: "MIT", usage: "Pretrained CLIP weights" },
    ],
  },
];

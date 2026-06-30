// AI Training Pipeline showcase data
// Each domain: title, description, icon, pipeline steps, code snippet, metrics, demo URL, tech stack

export const aiTrainingDomains = [
  {
    id: "medical",
    title: "Medical Imaging",
    tagline: "DICOM/NIfTI → Classification",
    icon: "🩺",
    color: "from-blue-500 to-cyan-500",
    description:
      "A medical imaging preprocessing and classification pipeline built on SimpleITK, pydicom, and MONAI. Handles DICOM/NIfTI ingestion, HU windowing, resampling, and normalization. Demo model is a U-Net classifier trained on MedNIST.",
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
  },
  {
    id: "geospatial",
    title: "Geospatial",
    tagline: "GeoTIFF → Segmentation",
    icon: "🗺️",
    color: "from-green-500 to-emerald-500",
    description:
      "A geospatial preprocessing and segmentation pipeline built on rasterio, geopandas, and segmentation-models-pytorch. Handles GeoTIFF ingestion, reprojection, normalization, tiling, and vector label rasterization. Demo model is a U-Net (ResNet18) for land/water segmentation.",
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
    demoUrl: 'https://fjkiani-ai-geospatial.hf.space'",
    repoUrl: "https://github.com/fjkiani/ai-training/tree/main/domains/geospatial",
    inputType: "Satellite tile (PNG/JPG)",
    outputType: "Land/water segmentation mask",
  },
  {
    id: "audio",
    title: "Audio",
    tagline: "WAV/MP3 → Classification",
    icon: "🔊",
    color: "from-purple-500 to-violet-500",
    description:
      "An audio preprocessing and classification pipeline built on librosa and scikit-learn. Handles audio loading, resampling, feature extraction (MFCC, mel-spectrogram, chroma, spectral contrast, tonnetz), and aggregation. Demo model is a Random Forest trained on ESC-50 (50 environmental sound classes).",
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
      { label: "Classes", value: "50" },
      { label: "Features", value: "130-dim" },
      { label: "Dataset", value: "ESC-50" },
      { label: "Train Time", value: "Seconds" },
    ],
    techStack: ["librosa", "soundfile", "scikit-learn", "Gradio", "matplotlib"],
    demoUrl: 'https://fjkiani-ai-audio.hf.space'",
    repoUrl: "https://github.com/fjkiani/ai-training/tree/main/domains/audio",
    inputType: "Audio file (WAV/MP3)",
    outputType: "Class prediction + spectrogram",
  },
  {
    id: "video",
    title: "Video",
    tagline: "MP4 → Scene Detection + Tags",
    icon: "🎬",
    color: "from-orange-500 to-red-500",
    description:
      "A video preprocessing pipeline built on PySceneDetect, OpenCV, and HuggingFace Transformers (CLIP). Detects scene boundaries, extracts representative keyframes, deduplicates near-identical frames, and performs zero-shot classification using CLIP. No training required — CLIP's pretrained weights provide zero-shot tagging.",
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
      { label: "Train Time", value: "None" },
    ],
    techStack: ["PySceneDetect", "OpenCV", "Transformers", "CLIP", "Gradio"],
    demoUrl: 'https://fjkiani-ai-video.hf.space'",
    repoUrl: "https://github.com/fjkiani/ai-training/tree/main/domains/video",
    inputType: "Video (MP4)",
    outputType: "Scene list + keyframes + CLIP tags",
  },
];

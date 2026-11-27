"""CLIP image embeddings (ViT-B/32, 512 numbers). Pretrained; nothing is trained here."""

import open_clip
import torch
from PIL import Image

MODEL_NAME = "ViT-B-32"
PRETRAINED = "laion2b_s34b_b79k"
VERSION = f"clip-{MODEL_NAME}-{PRETRAINED}"


class Embedder:
    def __init__(self):
        self.model, _, self.preprocess = open_clip.create_model_and_transforms(MODEL_NAME, pretrained=PRETRAINED)
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model.to(self.device).eval()

    @torch.inference_mode()
    def embed(self, images: list[Image.Image]) -> torch.Tensor:
        """Unit-length vectors, one row per image."""
        batch = torch.stack([self.preprocess(image.convert("RGB")) for image in images])
        return torch.nn.functional.normalize(self.model.encode_image(batch.to(self.device)), dim=1).cpu()

    @torch.inference_mode()
    def embed_text(self, prompts: list[str]) -> torch.Tensor:
        tokens = open_clip.get_tokenizer(MODEL_NAME)(prompts)
        return torch.nn.functional.normalize(self.model.encode_text(tokens.to(self.device)), dim=1).cpu()

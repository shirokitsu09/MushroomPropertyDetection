from fastapi import FastAPI, UploadFile, File
from PIL import Image
import torch
import torch.nn as nn
import torchvision
import torchvision.transforms as transforms
from torchvision import models
import io
from pyngrok import ngrok
import nest_asyncio
import uvicorn
import matplotlib.pyplot as plt
from PIL import Image

# Load the model and modify the last layer for the number of classes
model = models.resnet18(weights=None)
num_classes = 34
model.fc = nn.Linear(model.fc.in_features, num_classes)
model.load_state_dict(torch.load("best.pth", map_location=torch.device('cpu')))

# Define data transformations
data_transforms = transforms.Compose([
    transforms.Resize((224, 224)),  # Resize image to 224x224
    transforms.ToTensor(),  # Convert image to tensor
    transforms.Normalize(mean=[0.4293, 0.3925, 0.3282], std=[0.2249, 0.2143, 0.2053])
])

# Define the classes
classes = [
    'Agaricus augustus', 'Amanita calyptroderma', 'Artomyces pyxidatus', 'Boletus pallidus',
    'Coprinellus micaceus', 'Crucibulum laeve', 'Cryptoporus volvatus', 'Flammulina velutipes',
    'Ganoderma tsugae', 'Grifola frondosa', 'Hericium erinaceus', 'Hypomyces lactifluorum',
    'Hypsizygus tessellatus', 'Lactarius indigo', 'Laetiporus sulphureus', 'Lentinula edodes',
    'Leratiomyces ceres', 'Leucoagaricus leucothites', 'Lycoperdon pyriforme', 'Phyllotopsis nidulans',
    'Pleurotus pulmonarius', 'Pseudohydnum gelatinosum', 'Psilocybe cubensis', 'Psilocybe pelliculosa',
    'Retiboletus ornatipes', 'Schizophyllum commune', 'Stereum ostrea', 'Stropharia ambigua',
    'Suillus luteus', 'Trametes betulina', 'Trametes gibbosa', 'Tuber melanosporum',
    'Tylopilus felleus', 'Volvopluteus gloiocephalus'
]

# Initialize the FastAPI app
app = FastAPI()

# List to store results
results = []

# Function to predict from an image
def predict_image(image, model):
    # Transform the image and add a batch dimension
    image = data_transforms(image).unsqueeze(0)

    # Set the model to evaluation mode
    model.eval()

    # Make a prediction without calculating gradients
    with torch.no_grad():
        outputs = model(image)
        _, predicted = torch.max(outputs, 1)

    return predicted.item()

# Endpoint for image prediction via API
# Endpoint for image prediction via API
@app.post("/predict/")
async def predict(hello: UploadFile = File(...)):
    # Read the image file
    image = Image.open(io.BytesIO(await hello.read()))

    # Convert image to RGB (to handle cases where image is not in RGB format)
    if image.mode != "RGB":
        image = image.convert("RGB")

    predicted_class = predict_image(image, model)

    # Store the prediction result
    result = {"predicted_class": classes[predicted_class]}
    results.append(result)

    # Return the prediction result
    return result

# Endpoint to get all prediction results
@app.get("/results/")
def get_results():
    # Return all stored prediction results
    return {"results": results}

# Set up Ngrok for tunneling
ngrok.set_auth_token("2nO2btEi0iFZEi7KSQKVRDgDGsP_82SCfBetkF7oRqsn9TYWF")
public_url = ngrok.connect(8000)
print(f"Access the API via: {public_url}")

# Enable nest_asyncio to run FastAPI with Ngrok in Jupyter or similar environments
nest_asyncio.apply()

# Run the app with Uvicorn
uvicorn.run(app, host='0.0.0.0', port=8889)

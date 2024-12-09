import json

# Load the nested JSON file
with open('./data/testData1.json', 'r') as file:
    data = json.load(file)

flattened_data = []

def flatten_node(node, parent_id=None):
    # Add the current node to the flattened list
    doc = {
        "_id": node["_id"],
        "name": node["name"],
        "level": node["level"],
        "value": node["value"],
        "parent_id": parent_id
    }
    flattened_data.append(doc)
    
    # Process children if they exist
    if "children" in node:
        for child in node["children"]:
            flatten_node(child, node["_id"])

# Flatten the top-level nodes
for root in data:
    flatten_node(root)

# Save the flattened data to a new JSON file
with open('flattened_data.json', 'w') as file:
    json.dump(flattened_data, file, indent=2)

print("Flattening complete. Flattened data saved to 'flattened_data.json'.")

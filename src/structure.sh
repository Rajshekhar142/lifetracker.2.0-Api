#!/bin/bash

# Define the components to generate
value_array=("module" "service" "controller")

# Read user input into an array (space-separated names)
echo "Enter the names of the resources (e.g., users auth products):"
read -r -a input_array

# Loop through each user-inputted resource
for value in "${input_array[@]}"; do
    # Loop through each NestJS component type
    for v in "${value_array[@]}"; do
        # Execute the Nest CLI command
        nest generate "$v" "$value"
    done
done

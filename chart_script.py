import pandas as pd
import plotly.graph_objects as go
import json

# Load the comparison data
data = {
    "comparison": [
        {"aspect": "HTML Structure", "original": "Basic HTML structure", "enhanced": "Modern responsive design"},
        {"aspect": "Visual Hierarchy", "original": "Limited visual hierarchy", "enhanced": "Clear visual hierarchy with professional typography"},
        {"aspect": "Mobile Experience", "original": "No mobile optimization", "enhanced": "Mobile-first responsive layout"},
        {"aspect": "Property Listings", "original": "Basic property listings", "enhanced": "Interactive property cards with hover effects"},
        {"aspect": "SEO Optimization", "original": "Minimal SEO optimization", "enhanced": "SEO-optimized with meta tags and structured headings"},
        {"aspect": "Contact Interface", "original": "Simple contact information", "enhanced": "Professional contact form with validation"},
        {"aspect": "User Interaction", "original": "No interactive elements", "enhanced": "Smooth scrolling navigation and mobile menu"},
        {"aspect": "Design Aesthetics", "original": "Generic color scheme", "enhanced": "Professional color scheme (blues and neutrals)"},
        {"aspect": "User Experience", "original": "Basic functionality", "enhanced": "Enhanced UX with modern design principles"}
    ]
}

# Create abbreviated versions for the 15-character limit
aspects = [
    "HTML Structure",
    "Visual Design", 
    "Mobile Support",
    "Property Lists",
    "SEO Features",
    "Contact Form",
    "Interactions", 
    "Color Scheme",
    "User Experience"
]

original_features = [
    "Basic HTML",
    "Limited design",
    "No mobile opt",
    "Basic listings", 
    "Minimal SEO",
    "Simple contact",
    "No interaction",
    "Generic colors",
    "Basic function"
]

enhanced_features = [
    "Modern design",
    "Clear hierarchy",
    "Mobile-first",
    "Interactive",
    "SEO optimized", 
    "Pro form",
    "Smooth nav",
    "Pro colors",
    "Enhanced UX"
]

# Create the comparison table
fig = go.Figure(data=[go.Table(
    header=dict(
        values=['<b>Feature</b>', '<b>Original Site</b>', '<b>Enhanced Site</b>'],
        fill_color=['#5D878F', '#B4413C', '#1FB8CD'],
        align='center',
        font=dict(color='white', size=14),
        height=40
    ),
    cells=dict(
        values=[aspects, original_features, enhanced_features],
        fill_color=[['#ECEBD5']*len(aspects), 
                   ['#FFC185']*len(aspects), 
                   ['#D2BA4C']*len(aspects)],
        align='left',
        font=dict(color='black', size=12),
        height=35
    )
)])

fig.update_layout(
    title="A.P Realty Group Website Improvements",
    font=dict(family="Arial"),
)

# Save the chart
fig.write_image("website_comparison.png")
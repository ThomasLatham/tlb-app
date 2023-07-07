---
id: "nmf-earth-unit-toggle"
title: "NMF.earth"
role: "Contributor"
description:
  "Implemented units toggle in this open-source application, enhancing user experience and
  global accessibility."
cardImage: "nut-image.png"
---

## Project Overview

[NMF.earth](https://nmf.earth/) is an open-source mobile application created by
[Pierre Bresson](https://pierre.bresson.io/) designed to help users understand and reduce their
carbon footprint. The app enables users to track various activities such as transportation, food,
electricity, streaming, clothing, and even cryptocurrency and purchases. It provides detailed carbon
emission information, including the ability to scan food product barcodes for environmental impact
data.

## My Contribution

I implemented a units toggle feature in the app's settings, allowing users to switch between metric
and United States customary units for all displayed measurements. This feature enhances user
accessibility and makes the application more inclusive for users across different regions.
Additionally, I provided translations for the units in multiple languages to support the
application's internationalization efforts, and I thoroughly covered all my contributed code with
tests.

## Technologies Used

- React Native
- TypeScript
- Redux
- CSS
- Jest (unit and snapshot testing)

## Challenges and Solutions

The main challenge was ensuring consistent unit conversion throughout the app while maintaining a
seamless user experience. To overcome this, I thoroughly analyzed the existing codebase, identified
the areas where unit conversion was needed, and implemented a modular and efficient solution to
handle the toggling of units. I also utilized the Redux "ducks" pattern to update and consume the
application state for the user's units preference.

## Collaboration and Communication

Throughout the process, I collaborated with the project owner through discussions on GitHub. I
actively participated in code reviews and addressed feedback to ensure a smooth integration of the
feature into the project.

## Impact and Results

The units toggle feature I implemented, along with the translation support for units, has improved
the user experience of the NMF.earth mobile application. Users now have the flexibility to track
their carbon footprints in their preferred unit system, and the app is more accessible to users
worldwide. This contribution contributes to the app's mission of helping anyone understand and
reduce their carbon footprint.

## Project Links

- [GitHub Repository](https://github.com/NMF-earth/nmf-app)
- [Pull Request](https://github.com/NMF-earth/nmf-app/pull/365)
- [NMF.earth Website](https://nmf.earth/)

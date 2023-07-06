---
id: "ava"
title: "AVA: Automated Validation Application"
role: "Creator"
description:
  "Automation tool for ETL QA, enabling comprehensive data comparison and integration with Jira for
  issue tracking."
cardImage: "ava-image.png"
---

## Project Description

AVA (Automated Validation Application) is an automation tool designed for performing Quality
Assurance (QA) on ETL (Extract, Transform, Load) projects. It allows parallel usage by multiple team
members and offers data validation, comparison, and reporting capabilities. AVA integrates with Jira
for automated issue tracking and enables partitioning of large datasets for parallel processing.

## Features

- Local execution for parallel usage by multiple team members
- Data extraction from various sources based on user input
- Integration with multiple legacy and modern databases
- Comprehensive data validation (row-wise, column-wise, schema)
- Detailed reports with pass/fail status and precise differences in datasets
- Automatic uploading of reports to Jira and issue tracking integration
- Partitioning tool for large dataset processing
- Extensive documentation on setup and usage using reStructuredText (markup syntax)
- Utilized Sphinx and extensive docstrings for easy maintenance by future developers

## Technologies Used

- Python 3.6
- Databases: Multiple legacy and modern database engines
- Pandas package for data organization
- DataComPy package for data comparison
- Jira REST APIs for issue tracking
- Zephyr Scale APIs for issue tracking
- Microsoft Excel for user input
- BitBucket and Git for version control

## My Role

As the creator of AVA, I envisioned, developed, and maintained the application. I incorporated input
from my team members who also used the app.

## Results

- Virtually replaced the old manual workflow
- Improved team efficiency by saving hundreds of hours each month
- Enabled the QA team to reduce in size, resulting in cost savings for the client and the company
- Still utilized by the QA team as their primary analysis tool
- Flexible design enabled quick development of additional features, such as the partitioning tool,
  to meet tight client deadlines

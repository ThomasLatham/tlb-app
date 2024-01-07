---
id: "fantasy-art-forever"
title: "Fantasy Art Forever"
role: "Creator"
description: |
  Fantasy Art Forever is an automated project focused on posting fantasy art to Instagram on a daily basis, sourcing artwork from Reddit.
cardImage: "faf-image.jpeg"
---

## Project Overview

Fantasy Art Forever aims to curate and share fantasy-themed artwork sourced from the [Imaginary
Network Expanded](https://old.reddit.com/r/ImaginaryBestOf/wiki/networksublist), providing daily
content for Instagram users. The project operates on a well-defined posting schedule, focusing on
different fantasy themes each day of the week.

## My Role

As the creator and sole developer of Fantasy Art Forever, my role encompassed the conceptualization,
design, and implementation of the entire project.

## How It Works

### Sourcing Posts from Reddit
We persist a queue of future Instagram posts such that for every subreddit from which we source
content we always have 1 post queued up and 2 posts as backups. 

When a queued post for some subreddit is used for an Instagram post, that post is removed from the
queue, and the oldest backup post for that subreddit takes its place. The backup posts are
"refilled" periodically — every 6 hours a script runs which checks for missing backups and replaces
them with the top post of the week from the correct subreddit.

The post queue was initialized with the top 3 posts of all time from each sourcing subreddit.

### Posting to Instagram
Once a day, we post to Instagram according to the above posting schedule.

If post creation fails due to something about the sourced Reddit post, then we try posting with the
oldest backup. If it succeeds then we dequeue both the succeeding backup and the failing queued
post. If the backup fails due to something about the sourced Reddit post, then we try with the other
backup, dequeuing all 3 in case of success or Reddit-post-induced failure.

The time of day Instagram posts are made is randomized between 5 different times: 6 am, 9 am, 12 pm,
3 pm and 6 pm (all Eastern Time).

### Technologies Used
The bot is an [Express](https://expressjs.com/) application hosted on [Render](https://render.com/).
Express offers a very convenient and flexible way to define API endpoints, where the business logic
of the application is stored. Render gives us a free way to host the application on the web.

Having one endpoint for the logic of sourcing Reddit posts and another for the logic of posting to
Instagram, we then use the cron-scheduling service [cron-job.org](https://cron-job.org/en/) (also
free; maybe you're starting to see a theme here) to call those endpoints on set schedules.

For the part in between sourcing posts from Reddit and creating posts on Instagram — that is, for
persisting the Reddit posts' details — I'm using [Supabase](https://supabase.com/) (you guessed it,
for free).

## Motivation

The creation of Fantasy Art Forever was driven by multiple motivations:
1. Automating the process of sharing fantasy art on Instagram.
2. Sharing the love for fantasy art with a wider audience.
3. Analyzing the scraped data for potential insights.
4. Providing content for potential blogging opportunities.

## Project Links

- [GitHub Repository](https://github.com/ThomasLatham/fantasy-art-forever/)
- [Instagram Account (@fantasyartforever)](https://www.instagram.com/fantasyartforever/)
- [Reddit Account](https://old.reddit.com/user/fantasy-art-forever/)


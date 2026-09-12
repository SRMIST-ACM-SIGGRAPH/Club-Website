# Interview Scheduling Configuration

This folder handles the Calendly interview scheduling for applicants.

## How it works

1. The user logs in and the system fetches their applications from Supabase.
2. If they applied for multiple domains, they can choose which domain to schedule an interview for via a dropdown.
3. The page renders an inline Calendly widget specific to that domain, with their name and email prefilled.

## Updating Calendly Links

To update the event links for the different panels, simply open `booking-config.json` and change the URLs.

```json
{
  "domains": {
    "Web Development": "https://calendly.com/srmacmsiggraph/recruitment-web-dev",
    "Corporate": "https://calendly.com/your-username/corporate",
    "Media & PR": "https://calendly.com/your-username/media-pr",
    "R&D": "https://calendly.com/your-username/r-d"
  }
}
```

Make sure the keys in this JSON file match exactly with the domain options specified in `src/components/recruit/recruit.json`.

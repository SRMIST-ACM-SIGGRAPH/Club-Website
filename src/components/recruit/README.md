# Recruitment Configuration

This directory contains two JSON files that control the logic of the recruitment form without requiring any React code changes. This ensures that future board members can easily manage recruitments.

## 1. `domain_questions.json`
This file controls the dynamic questions that appear based on which domain a user selects in the form.

### Supported Fields:
- **`id`**: A unique string for the question (e.g., `"github_url"`). This is the key that will be sent to the database.
- **`label`**: The actual question shown to the user.
- **`type`**: The type of input field. Supported values:
  - `"text"`: Standard short text input
  - `"url"`: Text input that expects a URL
  - `"textarea"`: A large multiline textbox for longer answers
  - `"number"`: Number input
- **`required`**: `true` or `false`. If true, the user cannot submit without answering.
- **`placeholder`**: The ghost text inside the input field.

### Adding a new domain:
Simply add a new top-level key matching the EXACT name of the domain in the dropdown, and provide an array of question objects.

---

## 2. `recruit.json`
This file controls the deadlines and open/close status of recruitments.

### The `global_sync` Master Switch:
- If `"global_sync": true`: 
  The form ignores all individual domain settings. It looks ONLY at `"global_settings"`. If `global_settings.is_open` is true and the deadline hasn't passed, ALL domains are open.
- If `"global_sync": false`:
  The form ignores the global settings and looks at the `"domains"` object. Each domain will independently check its own `"is_open"` flag and `"deadline"`.

### Automations
- **Auto-Close**: If the current date and time passes the `deadline`, the form will automatically lock down, either globally (if synced) or for that specific domain.
- **Timezones**: The `deadline` must be in a valid ISO 8601 format. For Indian Standard Time (IST), ensure you append `+05:30` at the end of the timestamp (e.g., `"2026-08-01T23:59:59+05:30"`).

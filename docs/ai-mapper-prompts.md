# AI Mapper Prompts — Scholarship Copilot

This file contains production-ready LLM prompts and six realistic examples for extracting form-to-profile mappings from scholarship application forms. Use these prompts with your chosen LLM (Gemini, OpenAI, etc.). Always run the Post-LLM Validation Checklist after getting model output.

## System Prompt

You are an assistant whose job is to extract a reliable mapping from an HTML form (or a minimal DOM subtree containing the form) to the application's user profile fields. Respond only with JSON that follows the required schema. Be conservative: prefer returning fewer high-confidence selectors rather than many low-confidence guesses. Do not return explanatory text.

## User Prompt (Primary)

Given the HTML of the scholarship application form (only the `<form>` element or the minimal DOM subtree containing the form), produce a JSON array of mappings. Each mapping item must include: `selector`, `profileKey`, `inputType`, `exampleValue`, and `confidence` (0-1). Map to these profile keys: `firstName`, `lastName`, `email`, `phone`, `address`, `nationality`, `dob`, `gpa`, `major`, `degreeLevel`, `bio`, `resume`, `personalStatement`, `other`.

If the form has multi-step sections, include a `step` integer (0-based). If you cannot find a reliable selector for a specific profileKey, omit that field. Use confidence >= 0.75 for high-confidence mappings. Return only JSON.

### Expected JSON schema (example):

```json
[{
  "selector": "#firstName",
  "profileKey": "firstName",
  "inputType": "text",
  "exampleValue": "Jane",
  "confidence": 0.95,
  "step": 0
}]
```

---

## Examples (few-shot)

Example 1 — Simple single-step form

Input HTML:

```html
<form id="apply">
  <label for="fname">First Name</label>
  <input id="fname" name="first" type="text" />

  <label for="gpa">GPA</label>
  <input id="gpa" name="gpa" type="text" />

  <label for="cv">Upload CV</label>
  <input id="cv" name="resume_file" type="file" />
</form>
```

Expected output:

```json
[{"selector":"#fname","profileKey":"firstName","inputType":"text","exampleValue":"Jane","confidence":0.95,"step":0},{"selector":"#gpa","profileKey":"gpa","inputType":"text","exampleValue":"3.8","confidence":0.9,"step":0},{"selector":"#cv","profileKey":"resume","inputType":"file","exampleValue":"https://example.com/resume.pdf","confidence":0.98,"step":0}]
```

Example 2 — Multi-step form (two steps)

Input HTML (simplified):

```html
<form id="apply">
  <div class="step" data-step="0">
    <label>First Name</label>
    <input name="app[first_name]" />
  </div>
  <div class="step" data-step="1">
    <label>Personal Statement</label>
    <textarea name="app[ps]"></textarea>
  </div>
</form>
```

Expected output:

```json
[{"selector":"[name=\"app[first_name]\"]","profileKey":"firstName","inputType":"text","exampleValue":"Jane","confidence":0.9,"step":0},{"selector":"[name=\"app[ps]\"]","profileKey":"personalStatement","inputType":"textarea","exampleValue":"I am applying because...","confidence":0.88,"step":1}]
```

Example 3 — Radio and select inputs

Input HTML:

```html
<form>
  <label>Degree level</label>
  <select id="degree-level"><option>Master's</option></select>

  <label>Are you eligible?</label>
  <input type="radio" name="eligible" value="yes" /> Yes
  <input type="radio" name="eligible" value="no" /> No
</form>
```

Expected output:

```json
[{"selector":"#degree-level","profileKey":"degreeLevel","inputType":"select","exampleValue":"Master's","confidence":0.9,"step":0},{"selector":"input[name=\"eligible\"][value=\"yes\"]","profileKey":"other","inputType":"radio","exampleValue":"yes","confidence":0.7,"step":0}]
```

Example 4 — Inputs with placeholders and aria-labels

Input HTML:

```html
<form>
  <input placeholder="Enter your email" aria-label="email address" />
  <input name="gpa_val" placeholder="4.0" />
</form>
```

Expected output:

```json
[{"selector":"input[aria-label=\"email address\"]","profileKey":"email","inputType":"email","exampleValue":"jane@example.com","confidence":0.85,"step":0},{"selector":"input[name=\"gpa_val\"]","profileKey":"gpa","inputType":"text","exampleValue":"3.9","confidence":0.8,"step":0}]
```

Example 5 — Obscure names and labels (heuristic label matching)

Input HTML:

```html
<form>
  <label for="xQ1">Surname</label>
  <input id="xQ1" name="q_1" />
  <label for="xQ2">Given name</label>
  <input id="xQ2" name="q_2" />
</form>
```

Expected output (use label meaning rather than name):

```json
[{"selector":"#xQ2","profileKey":"firstName","inputType":"text","exampleValue":"Jane","confidence":0.88,"step":0},{"selector":"#xQ1","profileKey":"lastName","inputType":"text","exampleValue":"Doe","confidence":0.88,"step":0}]
```

Example 6 — File uploader behind custom UI (low confidence)

Input HTML (simplified):

```html
<form>
  <div class="custom-uploader">
    <button class="upload-btn">Upload CV</button>
    <input type="file" id="hidden-cv" style="display:none" />
  </div>
</form>
```

Expected output (note lower confidence and notes field):

```json
[{"selector":"#hidden-cv","profileKey":"resume","inputType":"file","exampleValue":"https://example.com/resume.pdf","confidence":0.6,"step":0,"notes":"Custom uploader UI; file input hidden behind button — may require special handling"}]
```

---

## Usage notes

- Always run the Post-LLM Validation Checklist (existence, type, visibility, fillability, CAPTCHA detection) using a headless browser before attempting to auto-fill.
- If the LLM returns invalid JSON, attempt to extract the JSON blob; if extraction fails, mark for manual review.

---

End of prompts file.

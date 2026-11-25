# The Little Letters Club — website

Static website for The Little Letters Club (TLLC), Singapore. Plain HTML, CSS and JavaScript: no build step, no server code.

## Clean URLs

Every page lives in its own folder, so addresses have no `.html`:
`thelittlelettersclub.org/about/`, `/team/`, `/kafia/`, `/volunteer/` and so on. Links, styles, scripts and images all use paths from the site root (`/assets/…`, `/js/…`), so the site must be served **at the root of a domain**.

## Go live: GitHub → Vercel → thelittlelettersclub.org

`vercel.json` is included: it adds clean-URL handling (`/about` → `/about/`), redirects old `.html` addresses, long caching for images and basic security headers.

1. **GitHub:** put **everything inside this folder** at the root of the `meitongkim/thelittlelettersclub` repository (`index.html` and `vercel.json` at the top level), replacing the old files.
2. **Vercel:** Add New → Project → import `thelittlelettersclub`. Framework preset: **Other**. Leave Build Command and Install Command empty; Output Directory: `.` (root). Deploy.
3. **Domain:** in the project, Settings → Domains → add `thelittlelettersclub.org`, then `www.thelittlelettersclub.org` (set it to redirect to the main domain).
4. **Porkbun DNS** (Domain Management → DNS): delete Porkbun's default parking records (the ALIAS/CNAME pointing to `pixie.porkbun.com`), then add the records Vercel shows. Usually:
   - `A` · host *(blank)* · `76.76.21.21`
   - `CNAME` · host `www` · `cname.vercel-dns.com`
   Use Vercel's values if they differ. HTTPS is issued automatically once DNS connects (minutes to a few hours).
5. **Email:** the site uses `hello@`, `volunteer@` and `partnerships@thelittlelettersclub.org`. In Porkbun → Email Forwarding, forward all three to an inbox you check.

To preview locally: run `python3 -m http.server` in this folder and open http://localhost:8000 (opening files directly with `file://` will not work).

## What's in here

| Path | What it is |
|---|---|
| `index.html` | Home (`/`) |
| `about/`, `team/`, profile pages (`meitong/`, `kym/`, `lynn/`, `harman/`, `laks/`, `kafia/`) | About and team |
| `programmes/`, `event/`, `collection/`, `gallery/`, `journal/`, `article/` | Our work and stories |
| `volunteer/`, `getinvolved/`, `exco/`, `community/`, `supportus/`, `opportunities/`, `remote/`, `creators/` | Getting involved |
| `chapters/`, `india/` | Chapters |
| `letterbox/`, `letterpreview/` | The Little Letterbox (drafts are saved only in the visitor's own browser) |
| `contact/`, `support/`, `sitemap/`, `404.html` | Contact, FAQ & policies (incl. whistleblowing), sitemap, not-found page |
| `sitemap.xml`, `robots.txt` | For search engines |
| `tokens.css`, `site.css`, `letterbox.css`, `ds/` | Styles |
| `assets/` | All images (TLLC artwork, mascots, stickers) |
| `js/tllc-runtime.js` | Small page renderer used by every page |
| `js/preact.min.js` | Preact 10 (MIT licence, see `js/PREACT-LICENSE.txt`) |

Each folder holds one `index.html`. The page's text and layout lives inside that file, in the `<script type="application/x-tllc-template">` blocks (layout) and the `TLLC.define(...)` blocks (data such as programme lists, team members, postbox notes and gallery items).

## Also included

- `sitemap.xml` and `robots.txt` for search engines, pointing at `https://thelittlelettersclub.org`. If your domain is different, change it in both files.
- A **Sitemap** page (`/sitemap/`) and a footer bar with Sitemap, Terms of Use, Privacy Notice, Whistleblowing Policy, social links and a **Subscribe** pop-up (first name, last name, email, a contact-preference tick and a required consent-to-store tick).

## Before launch checklist

**Connect the forms.** No form sends or stores anything yet; each one says so clearly after submitting. Connect each one to a form or mailing-list service, then swap the prototype message for a real thank-you:

| Placeholder | Where | What to connect |
|---|---|---|
| `[NEWSLETTER_ENDPOINT]` | footer "a little note in your inbox?" box and the Subscribe pop-up | mailing list (e.g. Mailchimp, Brevo). Save both consent ticks with a timestamp |
| `[VOLUNTEER_FORM_ENDPOINT]` | `/volunteer/` interest form | form service or Google Form |
| `[CONTACT_FORM_ENDPOINT]` | `/contact/` | form service or email |
| `[PARTNERSHIP_FORM_ENDPOINT]` | `/community/` | form service or email |

The EXCO application at `/exco/` is already live (Google Form https://forms.gle/XT2Qsqi6GL8y7t2c8).

**Fill in the policy contacts** on `/support/`: `[PRIVACY_CONTACT]`, `[WHISTLEBLOWING_CONTACT]` and the safeguarding lead `[TO BE NAMED]`. The Privacy Notice, Terms of Use and Whistleblowing Policy are marked "Pending review": have them reviewed (Singapore PDPA for privacy) and replace them with the adopted versions before collecting anyone's details.

**People and photos.** Confirm consent for every person on the Team and profile pages. Add real photos to the gallery only once publication approval and media consent are recorded.

**Accounts.** Confirm `hello@thelittlelettersclub.org` receives mail and the Instagram handle `@thelittlelettersclubsg` is correct.

**Private areas.** HQ, the volunteer console and the Little Creator dashboard are not in this site and need a secure backend (authentication, database-enforced access, MFA for admins) before they go live.

**Little Postbox.** The first notes are kindness prompts drafted for TLLC review. Edit them in the home page `index.html` (search for `POSTBOX`).

Generated from the TLLC Claude Design canvas.

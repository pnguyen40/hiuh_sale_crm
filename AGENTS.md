<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## CRM prototype
- The uploaded CRM is converted to native React, not embedded HTML or a second React runtime, so its interactions remain editable in Lovable.
- Keep prototype business records in React state and simulated service actions clearly mocked; live data storage and authentication require a separate integration request.
- Preserve the imported CRM design through global CSS tokens and the Button prototype variant; inline custom properties are reserved for data-driven values.
- Embedded fonts use Lovable asset pointers to preserve the supplied typography without repository binaries.

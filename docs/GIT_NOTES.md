# Git Notes

The local `.env` file should never be committed.

The repo should include a `.gitignore` entry for:

```text
node_modules/
.env
.env.*
!.env.example
```

If this file is missing locally, add it before running real provider tests.

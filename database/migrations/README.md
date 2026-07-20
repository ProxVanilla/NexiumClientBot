# Migrations

This project applies `schema.sql` on every boot using `CREATE TABLE IF NOT EXISTS`,
so simple additive changes don't need a migration file.

If you need to alter existing tables (rename/drop columns, backfill data), add a
numbered `.sql` file here, e.g. `001_add_mute_role.sql`, and run it manually with:

```
sqlite3 database/nexium.sqlite < database/migrations/001_add_mute_role.sql
```

# GEMINI.md — enfaci.com.br

Front React 19 da Enfaci (tenant 0). Consome a API api.postodeenfermagem.com.br. Sem Blade. Sem PEP neste repo.

## Produção (permanente)

O servidor (`enfaci.com.br` no cPanel) **não tem Node.js**.
Nunca pedir `npm` / `npx` / `vite` no hosting.
Build somente no computador local. Publicar o conteúdo de `dist/` com o `.sh` do humano.
`VITE_API_URL` e `VITE_TENANT_ID` têm de estar no `.env` local **antes** do `npm run build`.

## Terminal (contínuo neste workspace, só no PC)

Já autorizado, sem nova pergunta a cada comando:

- git add, git commit, git status, git diff, git push (sem --force), git pull, git checkout, git branch, git remote
- npm install, npm run build, npm run dev, npm run preview

Proibido sem pergunta nova:

- git push --force, git reset --hard, rm -rf, gravar secret em arquivo versionado
- qualquer npm no servidor

Execute o lote até o fim. Se um comando falhar, pare e cole a saída.

## Papel

Codificar o que o prompt pedir. Deploy no servidor é do humano (.sh + dist). Não misturar com o repo da API.

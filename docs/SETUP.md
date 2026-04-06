# 🚀 Setup do Projeto - Gestão Oficina

## ✅ Conexão com Supabase Configurada

### Variáveis de Ambiente (.env)

```env
# Connection Pooling (queries normais)
DATABASE_URL="postgresql://postgres.ekpngpbeqdqxxuciuznu:PkY8jv1WhMh3aJ3R@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Direct Connection (migrations)
DIRECT_URL="postgresql://postgres:PkY8jv1WhMh3aJ3R@db.ekpngpbeqdqxxuciuznu.supabase.co:5432/postgres"

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="https://ekpngpbeqdqxxuciuznu.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

Comandos Principais

Bash

# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Ver dados no Prisma Studio
npx prisma studio

# Popular banco com dados mock
npx prisma db seed

# Rodar aplicação
npm run dev

Migrations

Bash

# Ver status
npx prisma migrate status

# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations (produção)
npx prisma migrate deploy

# Reset completo (CUIDADO: apaga tudo)
npx prisma migrate reset --force

Troubleshooting

Problema: Dados não aparecem

    Verificar se rodou npx prisma db seed
    Verificar conexão: npx prisma studio
    Testar em: http://localhost:3000/test-db

Problema: Erro de serialização (Decimal/Date)

    Ver docs/ARMADILHAS.md
    Sempre usar Number() para Decimal
    Sempre usar .toISOString() para Date

text


---

### 3️⃣ **PRÓXIMOS PASSOS DE DESENVOLVIMENTO**

Agora que o banco está funcionando, você pode:

#### 🔴 **Prioridade ALTA (Bugs/Crítico)**

1. **Testar todos os CRUDs:**
   - [ ] Criar novo cliente
   - [ ] Editar cliente
   - [ ] Deletar cliente
   - [ ] Criar veículo
   - [ ] Criar OS
   - [ ] Adicionar items na OS
   - [ ] Aprovar orçamento
   - [ ] Finalizar OS

2. **Verificar serialização:**
   - [ ] Abrir F12 → Console em cada página
   - [ ] Procurar erros de "Decimal" ou "Date"
   - [ ] Corrigir se necessário

3. **Testar relatórios:**
   - [ ] Acessar `/relatorios`
   - [ ] Filtrar por período
   - [ ] Verificar se os totais batem

#### 🟡 **Prioridade MÉDIA (Melhorias UX)**

4. **Melhorar feedback visual:**
   - [ ] Toasts de sucesso/erro
   - [ ] Loading states
   - [ ] Confirmação antes de deletar

5. **Paginação e busca:**
   - [ ] Adicionar paginação nas listas grandes
   - [ ] Melhorar busca (debounce)

#### 🟢 **Prioridade BAIXA (Features Futuras)**

6. **Funcionalidades avançadas:**
   - [ ] Upload de imagens (Cloudinary)
   - [ ] WhatsApp integration
   - [ ] OCR de NF-e
   - [ ] Pós-venda

---

### 4️⃣ **DEPLOY (quando estiver pronto)**

```bash
# 1. Build local para testar
npm run build

# 2. Se passar, commitar
git add .
git commit -m "feat: conectar Supabase e popular dados"
git push

# 3. Deploy na Vercel (já detecta automaticamente)
# Só adicionar as variáveis de ambiente no dashboard da Vercel
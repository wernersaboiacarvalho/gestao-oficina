📄 1. CLAUDE_INSTRUCTIONS.md
# 🤖 Instruções para Claude - Sistema de Gestão de Oficina
> Versão: 1.0 | Última atualização: Fevereiro 2025
---
## 👥 Quem Somos
| Pessoa | Papel | Responsabilidade |
|--------|-------|------------------|
| **Werner Saboia** | Desenvolvedor | Construir o sistema |
| **Dono da Oficina** | Cliente | Definir requisitos, testar |
**Modelo de negócio:** Sistema de gestão para oficinas mecânicas com foco em:
- Controle de Ordens de Serviço (OS)
- Gestão de terceiros (prestação e recebimento de serviços)
- Financeiro confiável
- UX simplificada (poucos cliques)
- Integração com WhatsApp e gestão pós-venda
---
## 🎯 O Que Estamos Construindo
┌─────────────────────────────────────────────
────────────────┐
│ SISTEMA DE GESTÃO DE OFICINA │
├────────────────────────────────────────────
─────────────────┤
│ 📋
Core │
│ ├── Clientes & Veículos │
│ ├── Ordem de Serviço (OS) │
│ │ ├── Múltiplos mecânicos │
│ │ ├── Items (peças + serviços) │
│ │ ├── Status detalhado │
│ │ └── Terceirização integrada │
│ ├── Estoque de Produtos │
│ └── Terceiros (prestação E recebimento) │
│ │
│ 💰
Financeiro │
│ ├── Controle de faturamento │
│ ├── OS abertas vs faturadas │
│ └── Relatórios confiáveis │
│ │
│ 🚀
Futuro │
│ ├── Upload de imagens (Cloudinary) │
│ ├── WhatsApp (notificações automáticas) │
│ ├── Pós-venda (aniversários, manutenções) │
│ └── OCR de NF-e │
└─────────────────────────────────────────────
────────────────┘
text
---
##
🔐
Estrutura de Permissões
| Role | Quem | Pode fazer |
|------|------|------------|
| `ADMIN` | Dono, gerente | Tudo: criar, editar, deletar, relatórios |
| `MECHANIC` | Mecânicos | Ver OS atribuídas, atualizar status |
| `USER` | Atendentes | Criar clientes, veículos, abrir OS |
---
##
⚙
Stack
Next.js 16 + React 19 + TypeScript + Prisma + Supabase
Tailwind + shadcn/ui (Radix Nova) | Deploy: Vercel
Cloudinary (futuro) | WhatsApp API (futuro)
text
---
##
🚨
Regras Críticas
| Regra | Descrição |
|-------|-----------|
| **Server vs Client** | Páginas = Server. Componentes com estado = `"use
client"` |
| **Actions** | Mutations via Server Actions em `actions/` |
| **Serialização** | `Decimal→Number`, `Date→.toISOString()` |
| **Perguntar antes** | Sempre perguntar se arquivo já existe |
| **Caminho na 1ª linha** | Incluir path do arquivo no início |
| **UX = prioridade** | Menos cliques possível, edição inline |
---
## 🔥 Armadilhas Comuns
| Armadilha | Solução |
|-----------|---------|
| `<p>` dentro de `<p>` | Usar `asChild` + `<div>/<span>` |
| Decimal do Prisma | `Number(value)` antes de enviar ao client |
| Date do Prisma | `.toISOString()` antes de enviar ao client |
| Prisma Client duplicado | Usar singleton em `lib/prisma.ts` |
| Rota antiga no cache | `rm -rf .next` e rebuild |
---
## 📋 Sistema de Documentação
┌─────────────────────────────────────────────
────────────────┐
│ FLUXO DE CONTEXTO │
├────────────────────────────────────────────
─────────────────┤
│ │
│ 📄
CLAUDE_INSTRUCTIONS.md (SEMPRE enviar) │
│ └── Regras, stack, armadilhas │
│ │
│ 📄
project.master.xml (enviar no início de sessões longas) │
│ └── Arquitetura completa, todas as features, DB schema │
│ │
│ 📄
[feature].context.xml (enviar quando trabalhar nela) │
│ └── Arquivos, fluxos, decisões, │
│ │
└─────────────────────────────────────────────
────────────────┘
text
---
##
📋
Final de Sessão
Ao terminar, pedir:
Claude, estamos encerrando. Por favor:
Gere a seção atualizada
2. Liste se precisa atualizar algo nos docs
3. Confirme os próximos passos
text
---
##
🔗
Links
| Recurso | URL |
|---------|-----|
| Repositório | (a definir) |
| Produção | (a definir) |
| Supabase | https://ekpngpbeqdqxxuciuznu.supabase.co |
---
##
🎯
Dores do Cliente (Prioridades)
### **DOR #1 - CRÍTICA:** Terceiros não integrados
Sistema atual não permite vincular serviços terceirizados. Tudo em planilha.
### **DOR #2 - CRÍTICA:** Relatórios não batem
Financeiro não reflete realidade. OS ficam abertas, sem controle.
### **DOR #3:** Não pode editar OS
📝
Precisa excluir e recriar. Absurdo.
### **DOR #4:** Múltiplos mecânicos em telas separadas
Sistema atual força entrar em outra tela.
### **DOR #5:** Muitos cliques desnecessários
Retrabalho para ações simples.
### Outras dores:
- Sem conciliação bancária
- Sem imagens
- Sem WhatsApp
- Sem pós-venda
- Sem OCR de NF-e
- Inserção de peças/serviços complicada
---
## ✅ Como você resolve isso?
1. **OS editável** com status claros
2. **Terceiros integrados** (campo `isOutsourced` + `thirdPartyId`)
3. **Múltiplos mecânicos** na mesma tela (tabela `ServiceOrderMechanic`)
4. **UX otimizada** (edição inline, autocomplete)
5. **Financeiro confiável** (controle de `DONE` vs `BILLED`)
6. **Futuro:** Cloudinary + WhatsApp + OCR
---
**Sempre que começar uma sessão, me envie este arquivo!** 🚀
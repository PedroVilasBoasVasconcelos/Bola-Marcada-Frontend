# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]: ENCONTRE SEU CAMPO PERFEITO
  - generic [ref=e3]:
    - generic [ref=e5]: Seu navegador não suporta vídeos em HTML5.
    - navigation [ref=e7]:
      - generic [ref=e8]:
        - link "Logo Bola Marcada" [ref=e10] [cursor=pointer]:
          - /url: /
          - img "Logo Bola Marcada" [ref=e11]
        - link "CADASTRAR / ENTRAR" [ref=e14] [cursor=pointer]:
          - /url: rotas/login
    - generic [ref=e15]:
      - generic [ref=e16]:
        - heading "ENCONTRE SEU CAMPO PERFEITO" [level=1] [ref=e17]:
          - text: ENCONTRE SEU CAMPO
          - generic [ref=e18]: PERFEITO
        - paragraph [ref=e19]:
          - text: Reserve seu horário no campo mais próximo de
          - text: você e jogue sem preocupações!
      - generic [ref=e22]:
        - textbox "DIGITE SUA CIDADE..." [ref=e23]
        - button "BUSCAR" [ref=e24] [cursor=pointer]
```
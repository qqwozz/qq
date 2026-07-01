import { TranslationKey } from '../i18n'

interface CodeProps {
  t: (key: TranslationKey) => string
}

const snippets = [
  {
    title: 'C++ Matching Engine',
    lang: 'cpp',
    code: `bool MatchingEngine::processOrder(Order& order) {
    std::lock_guard<std::mutex> lock(mutex_);

    auto& book = orderbooks_[order.symbol];
    auto& queue = (order.side == Side::Buy)
        ? book.asks : book.bids;

    while (!queue.empty() && canMatch(order, queue.front())) {
        auto& resting = queue.front();
        fill(order, resting);

        if (resting.quantity == 0)
            queue.pop_front();
    }

    if (order.quantity > 0)
        book.add(order);

    return true;
}`,
  },
  {
    title: 'Go API Handler',
    lang: 'go',
    code: `func (h *Handler) CreateTransaction(c *gin.Context) {
    var req CreateTxRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }

    tx, err := h.svc.Process(c.Request.Context(), &req)
    if err != nil {
        c.JSON(500, gin.H{"error": err.Error()})
        return
    }

    c.JSON(201, tx)
}`,
  },
  {
    title: 'Python GigaChat',
    lang: 'python',
    code: `def chat(message: str, history: list) -> str:
    response = gigachat.chat(
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            *history,
            {"role": "user", "content": message}
        ],
        temperature=0.7,
        max_tokens=1024
    )
    return response.choices[0].message.content`,
  },
]

export function CodeSection({ t }: CodeProps) {
  return (
    <section className="section" id="code">
      <div className="container">
        <div className="section-number">
          003
          <div className="section-number-progress" />
        </div>
        <h2 className="section-title anim">код</h2>
        <div className="code-grid anim">
          {snippets.map((s, i) => (
            <div key={i} className="code-card">
              <div className="code-card-header">
                <span className="code-card-lang">{s.lang}</span>
                <span className="code-card-title">{s.title}</span>
              </div>
              <pre className="code-block">
                <code>{s.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

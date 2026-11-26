import styled from "styled-components";

// 답변 + 출처 + LangGraph 실행 경로(trace)
// 목표: 서버가 준 JSON 을 사람이 "검증할 수 있는" 화면으로 바꾸기

const NODE_LABEL = {
  retrieve: "검색",
  grade: "근거 평가",
  rewrite: "질문 재작성",
  generate: "답변 생성",
  abstain: "답변 보류",
  format: "정리",
};

const NODE_COLOR = {
  rewrite: ["#dbeafe", "#1e40af"],
  generate: ["#dcfce7", "#166534"],
  abstain: ["#ffedd5", "#9a3412"],
};

const Box = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  border-left: 5px solid ${(p) => (p.$abstained ? "#f97316" : "#4f46e5")};
`;
const Question = styled.p`
  margin: 0 0 8px;
  color: #6b7280;
  font-size: 14px;
`;
const Answer = styled.p`
  margin: 0 0 12px;
  line-height: 1.6;
`;
const Cite = styled.button`
  border: none;
  background: #eef2ff;
  color: #4f46e5;
  font-weight: 700;
  border-radius: 4px;
  padding: 0 4px;
  margin: 0 2px;
  cursor: pointer;
`;
const Heading = styled.h4`
  margin: 12px 0 6px;
  font-size: 14px;
  color: #374151;
`;
const SourceList = styled.ol`
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
  li {
    margin-bottom: 6px;
  }
`;
const LinkBtn = styled.button`
  border: none;
  background: none;
  padding: 0;
  color: #2563eb;
  cursor: pointer;
  font-size: 14px;
`;
const Meta = styled.span`
  color: #9ca3af;
  font-size: 12px;
`;
const Snippet = styled.p`
  margin: 2px 0 0;
  color: #6b7280;
  font-size: 13px;
`;
const TraceRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  font-size: 12px;
`;
const Node = styled.span`
  padding: 2px 8px;
  border-radius: 99px;
  font-weight: 600;
  background: ${(p) => (NODE_COLOR[p.$node] ?? ["#e5e7eb"])[0]};
  color: ${(p) => (NODE_COLOR[p.$node] ?? ["", "#374151"])[1]};
`;

// 답변 속 [#3] 표시를 누르면 해당 게시글을 연다
const AnswerText = ({ text, onOpenBoard }) => {
  const parts = text.split(/(\[#\d+\])/g);
  return (
    <Answer>
      {parts.map((part, i) => {
        const m = part.match(/^\[#(\d+)\]$/);
        return m ? (
          <Cite key={i} type="button" onClick={() => onOpenBoard(Number(m[1]))}>
            {part}
          </Cite>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </Answer>
  );
};

const AnswerView = ({ question, result, onOpenBoard }) => {
  const { answer, abstained, sources = [], trace = [] } = result;

  return (
    <Box $abstained={abstained}>
      <Question>Q. {question}</Question>
      <AnswerText text={answer} onOpenBoard={onOpenBoard} />

      {sources.length > 0 && (
        <>
          <Heading>출처 게시글</Heading>
          <SourceList>
            {sources.map((s) => (
              <li key={s.boardId}>
                <LinkBtn type="button" onClick={() => onOpenBoard(s.boardId)}>
                  #{s.boardId} {s.title}
                </LinkBtn>
                <Meta>
                  {" "}
                  · {s.author} · 유사도 {s.score.toFixed(2)}
                </Meta>
                <Snippet>{s.snippet}</Snippet>
              </li>
            ))}
          </SourceList>
        </>
      )}

      <Heading>실행 경로 (LangGraph trace)</Heading>
      <TraceRow>
        {trace.map((node, i) => (
          <span key={i}>
            {i > 0 && (
              <span style={{ color: "#9ca3af", marginRight: 4 }}>→</span>
            )}
            <Node $node={node} title={node}>
              {NODE_LABEL[node] ?? node}
            </Node>
          </span>
        ))}
      </TraceRow>
    </Box>
  );
};

export default AnswerView;

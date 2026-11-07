import { useEffect, useState } from "react";
import { Button, Card, Disclaimer } from "../components/Ui";
import { api } from "../lib/api";

type Question = { id: string; category: string; level: string; prompt: string; options: string[] };
type Mark = { correct: boolean; correctIndex: number; explanation: string; sourceName: string; sourceUrl: string };
type Progress = { results: Array<{ id: number; score: number; total: number; category: string; mode: string }>; badges: Array<{ id: string; label: string }> };

export function Quiz() {
  const [category, setCategory] = useState("consumer");
  const [level, setLevel] = useState("easy");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [marks, setMarks] = useState<Record<string, Mark>>({});
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState<Progress>({ results: [], badges: [] });
  const [mode, setMode] = useState<"practice" | "daily">("practice");

  async function loadProgress() {
    setProgress(await api<Progress>("/api/quiz/progress"));
  }
  useEffect(() => { void loadProgress(); }, []);

  async function start(nextMode: "practice" | "daily") {
    setMode(nextMode);
    setIndex(0);
    setMarks({});
    setScore(0);
    const data = nextMode === "daily"
      ? await api<{ questions: Question[] }>("/api/quiz/daily")
      : await api<{ questions: Question[] }>(`/api/quiz?category=${category}&level=${level}`);
    setQuestions(data.questions);
  }

  async function choose(choice: number) {
    const question = questions[index];
    if (marks[question.id]) return;
    const mark = await api<Mark>("/api/quiz/answer", { method: "POST", body: JSON.stringify({ id: question.id, choice }) });
    const nextScore = score + (mark.correct ? 1 : 0);
    setMarks({ ...marks, [question.id]: mark });
    setScore(nextScore);
    if (index === questions.length - 1) {
      await api("/api/quiz/results", { method: "POST", body: JSON.stringify({ category, level, score: nextScore, total: questions.length, mode }) });
      await loadProgress();
    }
  }

  const question = questions[index];
  return (
    <div>
      <h1 className="font-serif text-3xl text-navy">Know Your Rights Quiz</h1>
      <p className="mt-2 text-sm">Each explanation cites a statute or an official portal. A score is for learning, not a legal opinion.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {["consumer", "cyber", "traffic", "labour", "rights"].map((item) => <button key={item} className={`rounded-full border px-3 py-1 text-sm ${category === item ? "bg-navy text-white" : ""}`} type="button" onClick={() => setCategory(item)}>{item}</button>)}
        {["easy", "medium", "advanced"].map((item) => <button key={item} className={`rounded-full border px-3 py-1 text-sm ${level === item ? "bg-royal text-white" : ""}`} type="button" onClick={() => setLevel(item)}>{item}</button>)}
        <Button type="button" onClick={() => void start("practice")}>Start</Button>
        <Button kind="gold" type="button" onClick={() => void start("daily")}>Daily quiz</Button>
      </div>
      <Card className="mt-4">
        <h2 className="font-semibold">Progress</h2>
        <p className="text-sm">{progress.results.length} quizzes saved.</p>
        <ul className="mt-2 flex flex-wrap gap-2 text-sm">{progress.badges.map((badge) => <li key={badge.id} className="rounded-full bg-[#fbf7ef] px-3 py-1 text-gold">{badge.label}</li>)}</ul>
      </Card>
      {question && (
        <Card className="mt-4">
          <p className="text-sm text-gold">{question.category} · {question.level} · {index + 1} / {questions.length}</p>
          <h2 className="mt-2 text-xl text-navy">{question.prompt}</h2>
          <div className="mt-3 space-y-2">
            {question.options.map((option, choice) => <button key={option} className="block w-full rounded-xl border border-line px-3 py-2 text-left" type="button" onClick={() => void choose(choice)}>{option}</button>)}
          </div>
          {marks[question.id] && (
            <div className="mt-4 rounded-xl bg-paper p-3 text-sm">
              <p>{marks[question.id].correct ? "That matches the source." : "That does not match the source."}</p>
              <p className="mt-2">{marks[question.id].explanation}</p>
              <a className="text-royal" href={marks[question.id].sourceUrl} target="_blank" rel="noreferrer">{marks[question.id].sourceName}</a>
              {index < questions.length - 1 && <Button className="mt-3" type="button" onClick={() => setIndex(index + 1)}>Next</Button>}
              {index === questions.length - 1 && <p className="mt-3 font-semibold">Score {score} / {questions.length}</p>}
            </div>
          )}
        </Card>
      )}
      <Disclaimer />
    </div>
  );
}

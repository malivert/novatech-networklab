"use client";

import {
  ArrowRight,
  Binary,
  BookOpenCheck,
  BrainCircuit,
  Check,
  CircleCheck,
  Clock3,
  Network,
  RotateCcw,
  Router,
  Server,
  ShieldCheck,
  TerminalSquare,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { getCourse, networkCourses, type CourseIcon } from "@/data/courses";
import type { CourseProgress } from "@/types/network";

const courseIcons: Record<CourseIcon, LucideIcon> = {
  network: Network,
  binary: Binary,
  dhcp: Wifi,
  dns: Server,
  routing: Router,
  terminal: TerminalSquare,
  security: ShieldCheck,
  quiz: BrainCircuit,
};

interface CourseHubProps {
  progress: CourseProgress[];
  onComplete: (courseId: string, score: number) => void;
  onLaunchScenario: (scenarioId: string) => void;
}

export function CourseHub({ progress, onComplete, onLaunchScenario }: CourseHubProps) {
  const firstIncomplete =
    networkCourses.find((course) => !progress.find((item) => item.courseId === course.id)?.completed) ??
    networkCourses[0];
  const [selectedCourseId, setSelectedCourseId] = useState(firstIncomplete.id);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const selectedCourse = getCourse(selectedCourseId);
  const selectedProgress = progress.find((item) => item.courseId === selectedCourse.id);
  const completedCount = progress.filter((item) => item.completed).length;
  const averageScore = progress.length
    ? Math.round(progress.reduce((sum, item) => sum + item.bestScore, 0) / progress.length)
    : 0;
  const answeredCount = selectedCourse.quiz.filter((question) => answers[question.id] !== undefined).length;
  const quizScore = useMemo(() => {
    const correctAnswers = selectedCourse.quiz.filter(
      (question) => answers[question.id] === question.answerIndex,
    ).length;
    return Math.round((correctAnswers / selectedCourse.quiz.length) * 100);
  }, [answers, selectedCourse]);
  const passed = quizScore >= 67;

  function selectCourse(courseId: string) {
    setSelectedCourseId(courseId);
    setAnswers({});
    setSubmitted(false);
    window.setTimeout(() => {
      document.querySelector(".course-detail")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  function submitQuiz() {
    if (answeredCount !== selectedCourse.quiz.length) return;
    setSubmitted(true);
    onComplete(selectedCourse.id, quizScore);
  }

  function retryQuiz() {
    setAnswers({});
    setSubmitted(false);
    document.querySelector(".course-quiz")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const CourseIcon = courseIcons[selectedCourse.icon];

  return (
    <>
      <div className="course-summary">
        <article>
          <BookOpenCheck size={22} />
          <div><span>Modules validés</span><strong>{completedCount} / {networkCourses.length}</strong></div>
        </article>
        <article>
          <BrainCircuit size={22} />
          <div><span>Meilleure moyenne</span><strong>{averageScore} / 100</strong></div>
        </article>
        <article>
          <Clock3 size={22} />
          <div><span>Parcours complet</span><strong>1 h 46 min</strong></div>
        </article>
      </div>

      <div className="course-layout">
        <aside className="course-catalog panel">
          <div className="course-catalog-heading">
            <span className="eyebrow">PARCOURS GUIDÉ</span>
            <h2>8 modules réseau</h2>
            <p>Validez au moins 2 réponses sur 3 pour terminer un module.</p>
          </div>
          <div className="course-list">
            {networkCourses.map((course) => {
              const itemProgress = progress.find((item) => item.courseId === course.id);
              const Icon = courseIcons[course.icon];
              return (
                <button
                  className={`course-list-item ${selectedCourse.id === course.id ? "active" : ""}`}
                  type="button"
                  key={course.id}
                  onClick={() => selectCourse(course.id)}
                  aria-current={selectedCourse.id === course.id ? "true" : undefined}
                >
                  <span className="course-list-icon"><Icon size={17} /></span>
                  <span className="course-list-copy">
                    <small>MODULE {String(course.number).padStart(2, "0")} · {course.durationMinutes} MIN</small>
                    <strong>{course.shortTitle}</strong>
                  </span>
                  {itemProgress?.completed ? (
                    <CircleCheck className="course-done" size={19} />
                  ) : (
                    <span className="course-list-score">{itemProgress?.bestScore ?? 0}%</span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        <article className="course-detail panel">
          <header className="course-detail-header">
            <div className="course-detail-icon"><CourseIcon size={27} /></div>
            <div>
              <div className="course-meta">
                <span>MODULE {String(selectedCourse.number).padStart(2, "0")}</span>
                <span>{selectedCourse.level}</span>
                <span><Clock3 size={13} /> {selectedCourse.durationMinutes} min</span>
              </div>
              <h1>{selectedCourse.title}</h1>
              <p>{selectedCourse.description}</p>
            </div>
            {selectedProgress?.completed && (
              <span className="course-completed-badge"><Check size={15} /> Validé à {selectedProgress.bestScore}%</span>
            )}
          </header>

          <section className="course-objectives">
            <span className="eyebrow">OBJECTIFS</span>
            <div>
              {selectedCourse.objectives.map((objective) => (
                <p key={objective}><Check size={15} /> {objective}</p>
              ))}
            </div>
          </section>

          <div className="lesson-sections">
            {selectedCourse.sections.map((section, index) => (
              <section className="lesson-section" key={section.title}>
                <div className="lesson-number">{String(index + 1).padStart(2, "0")}</div>
                <div>
                  <h2>{section.title}</h2>
                  <p>{section.text}</p>
                  <ul>
                    {section.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                  {section.example && (
                    <div className="lesson-example">
                      <TerminalSquare size={16} />
                      <div><span>EXEMPLE</span><code>{section.example}</code></div>
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>

          <section className="course-quiz">
            <div className="course-quiz-heading">
              <div>
                <span className="eyebrow">VALIDATION DES ACQUIS</span>
                <h2>Quiz du module</h2>
                <p>{answeredCount} réponse(s) sur {selectedCourse.quiz.length}</p>
              </div>
              {selectedProgress && <span>Meilleur score : {selectedProgress.bestScore}%</span>}
            </div>

            <div className="quiz-questions">
              {selectedCourse.quiz.map((question, questionIndex) => (
                <fieldset className="quiz-question" key={question.id}>
                  <legend><span>{questionIndex + 1}</span>{question.question}</legend>
                  <div className="quiz-options">
                    {question.options.map((option, optionIndex) => {
                      const selected = answers[question.id] === optionIndex;
                      const correct = submitted && optionIndex === question.answerIndex;
                      const wrong = submitted && selected && optionIndex !== question.answerIndex;
                      return (
                        <button
                          className={`${selected ? "selected" : ""} ${correct ? "correct" : ""} ${wrong ? "wrong" : ""}`}
                          type="button"
                          key={option}
                          onClick={() => !submitted && setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                          disabled={submitted}
                          aria-pressed={selected}
                        >
                          <span>{String.fromCharCode(65 + optionIndex)}</span>
                          {option}
                          {correct && <Check size={16} />}
                        </button>
                      );
                    })}
                  </div>
                  {submitted && <p className="quiz-explanation">{question.explanation}</p>}
                </fieldset>
              ))}
            </div>

            {!submitted ? (
              <button
                className="primary-button course-quiz-submit"
                type="button"
                onClick={submitQuiz}
                disabled={answeredCount !== selectedCourse.quiz.length}
              >
                Corriger mes réponses <ArrowRight size={16} />
              </button>
            ) : (
              <div className={`quiz-result ${passed ? "passed" : "retry"}`}>
                <div>
                  {passed ? <CircleCheck size={29} /> : <RotateCcw size={29} />}
                  <div>
                    <span>{passed ? "MODULE VALIDÉ" : "ENCORE UN EFFORT"}</span>
                    <strong>{quizScore} / 100</strong>
                    <p>{passed ? "Les notions essentielles sont acquises." : "Relisez le cours puis obtenez au moins 67 %."}</p>
                  </div>
                </div>
                <div className="quiz-result-actions">
                  <button className="secondary-button" type="button" onClick={retryQuiz}>
                    <RotateCcw size={16} /> Refaire le quiz
                  </button>
                  {passed && (
                    <button className="primary-button" type="button" onClick={() => onLaunchScenario(selectedCourse.scenarioId)}>
                      Défi : {selectedCourse.scenarioLabel} <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>

          {!submitted && (
            <footer className="course-practice">
              <div><span className="eyebrow">MISE EN PRATIQUE</span><strong>{selectedCourse.scenarioLabel}</strong></div>
              <p>Terminez le quiz pour déverrouiller le défi associé.</p>
            </footer>
          )}
        </article>
      </div>
    </>
  );
}

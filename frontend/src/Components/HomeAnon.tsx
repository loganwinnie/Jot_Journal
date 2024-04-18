import AuthArea from "./Authentication/AuthArea";
import TextWall from "./TextWall";
/**
 * Renders Home Screen if Logged out
 *
 * App -> Home -> Auth Area
 */
function HomeAnon() {
  return (
    <>
      <TextWall />
      <div className="flex h-full flex-1 flex-col-reverse items-center justify-around gap-12 bg-light-100 px-0  pb-8 pt-32 md:px-16 lg:flex-row lg:items-start ">
        <div className="z-10 flex w-full flex-col items-center justify-start gap-16 rounded-lg border-4 bg-light-100 bg-opacity-80 p-8">
          <h1 className="text-primary-600 font-Raleway text-4xl font-bold underline decoration-primary-300">
            <span className="font-Flegrei text-primary-200">Jot</span> journal
          </h1>
          <img src="/Notebook.svg" alt="Logo" className="h-48 w-48 rotate-12" />
          <h3 className="text-xl font-semibold">
            Your new Ai journaling companion to make writing daily a little
            easier.
          </h3>
          <div className="w-full md:px-20">
            <p className="text-left">
              <span className="font-bold text-primary-500">
                Powered by Gtp-3.5
              </span>{" "}
              - Jot Journal, is personal space for self-reflection and growth.
              Powered by the GPT-3.5, Jot journal offers tailored prompts that
              guide you through the journaling process, making it easier than
              ever to capture your thoughts, emotions, and experiences. Whether
              you're a seasoned journaler or just starting out, Jot Journal
              helps you unlock your inner voice, explore your feelings, and
              track your personal journey. Dive into a world of self-discovery
              and see where jot journal takes you.
            </p>
          </div>
        </div>
        <AuthArea />
      </div>
    </>
  );
}

export default HomeAnon;

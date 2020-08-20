import useEffectOnce from './use-effect-once.hook';

const useTitle = (title: string) =>
  useEffectOnce(() => {
    document.title = `🏆 - Cloud(x); - Trivia - ${title}`;
  });

export default useTitle;

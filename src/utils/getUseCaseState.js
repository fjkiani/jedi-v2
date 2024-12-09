export const getUseCaseState = (useCase) => {
  return {
    query: '',
    loading: false,
    result: null,
    error: null,
    gridData: {
      components: useCase.implementation?.architecture?.components || [],
      flow: useCase.implementation?.architecture?.flow || [],
      benefits: useCase.implementation?.benefits || []
    }
  };
}; 
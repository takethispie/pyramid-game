export const DoesMatchExists = (matchId: string) => {
    return Promise.resolve(true);
}

export const IsMatchAlreadyStarted = (matchId: string) => {
    return Promise.resolve(false);
}

export const DoesNicknameAlreadyExistsInMatch = (matchId: string, nickname: string) => {
    return Promise.resolve(false);
}

export const ConnectToMatch = (id: string, nickname: string) => {
    return Promise.resolve(true);
}
export interface ScoreSpeechRequest {
    wordId: string;
    word: string;
    audio:  Blob | File,
}
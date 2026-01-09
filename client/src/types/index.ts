export interface Student {
    _id: string;
    name: string;
    place: string;
    stream?: string;
    dob?: string;
    marks: Record<string, number>;
    total: number;
}

export interface ExamConfig {
    [subject: string]: {
        maxMark: number;
        passMark: number;
    };
}

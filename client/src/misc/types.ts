interface CommentType {
    _id: string,
    postedby: string,
    comment: string,
    postedon: string,
    editedon: string,
    likes: string[],
}

interface SnippetType {
    _id: string,
    title: string,
    code: string,
    shortid: string
    postedby: string,
    postedon: string,
    editedon: string,
    likes: string[],
    comments: string[],
}

interface UserType {
    id: string;
    username: string;
    email: string;
    iat: number;
    exp: number;
}

interface CommentForm {
    user?: string,
    comment: string,
    shortid?: string,
}
interface SnippetForm {
    title: string;
    code: string;
}

interface SearchForm {
    search: string;
}

// export all
export type {
    CommentType,
    SnippetType,
    UserType,
    CommentForm as CommentFormType,
    SnippetForm as SnippetFormType,
    SearchForm as SearchFormType,
};
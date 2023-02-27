import { CommentType, CommentFormType, SnippetType, UserType, SnippetFormType } from './types';

interface SnippetProps {
    snippet: SnippetType | null,
    comments: CommentType[],
    user: UserType | null,
    handlers: {
        handleLikeButton: () => void,
        handleCommentSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
        handleCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        handleSnippetClick: (snippet: SnippetType | null) => void,
    },
    other: {
        snippetClicked: boolean,
        commentForm: CommentFormType,
    }
}

interface SnippetListProps {
    snippets: SnippetType[]
}

interface SnippetFormProps {
    data: SnippetFormType,
    handlers: {
        handleSnippetFormChange: (e: any) => void
        handleSnippetFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    }
}

export type {
    SnippetProps,
    SnippetListProps as SnippetGridProps,
    SnippetFormProps
};
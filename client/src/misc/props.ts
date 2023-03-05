
import {
  type CommentType,
  type CommentFormType,
  type SnippetType,
  type UserType,
  type SnippetFormType,
  type SearchFormType
} from './types'

interface SnippetProps {
  snippet: SnippetType | null
  comments: CommentType[]
  comment: CommentType | null
  user: UserType | null
  commentForm: CommentFormProps
  handlers: {
    handleLikeButton: (snippet: SnippetType | null) => void
    handleSnippetClick: (snippet: SnippetType | null) => void
    handleEditButton: (snippet: SnippetType | null) => void
    handleDeleteButton: (snippet: SnippetType | null) => void
    handleCommentEditButton: (comment: CommentType | null) => void
    handleCommentDeleteButton: (comment: CommentType | null) => void
    handleCommentLikeButton: (comment: CommentType | null) => void
  }
  clicked: boolean
}

interface SnippetListProps {
  snippets: SnippetType[]
}

interface SnippetFormProps {
  data: SnippetFormType
  handlers: {
    handleSnippetFormChange: (e: any) => void
    handleSnippetFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  }
}

interface SearchFormProps {
  data: SearchFormType
  handlers: {
    handleSearchFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSearchFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  }
}

interface HomeButtonsProps {
  handlePostButtonClick: () => void
  handleLogout: (event: any) => void
  user: UserType | null
}

interface CommentFormProps {
  handleCommentSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  handleCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  commentForm: CommentFormType
  // comment: CommentType | null,
}

export type {
  SnippetProps,
  SnippetListProps as SnippetGridProps,
  SnippetFormProps,
  HomeButtonsProps,
  CommentFormProps,
  SearchFormProps
}

interface CommentType {
    _id: string,
    postedby: string,
    comment: string,
    postedon: string,
}

interface SnippetType {
    _id: string,
    title: string,
    code: string,
    shortid: string
    postedby: string,
    postedon: string,
    likes: string[],
    comments: string[],

}


// export all
export type { CommentType, SnippetType };
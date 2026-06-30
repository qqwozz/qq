export interface GitHubUser {
  public_repos: number
  followers: number
}

export interface LeetcodeStats {
  solved: number
  totalSolved?: number
}

export interface Stats {
  repos: number
  leetcode: number
  followers: number
  languages: number
}

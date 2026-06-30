import { HTTPClient } from '../client/http';

// ── Writing DNA Types ──────────────────────────────────────────────────

export interface QuizAnswers {
  q1: string; // A/B/C/D - Opening energy
  q2: string; // A/B/C/D - Sentence structure
  q3: string; // A/B/C/D - Teaching style
  q4: string; // A/B/C/D - Jargon level
  q5: string; // A/B/C/D - Headline preference
  q6: string; // A/B/C/D - Humour level
  q7: string; // A/B/C/D - Confrontation style
  q8: string; // A/B/C/D - Vulnerability level
  q9: string; // A/B/C/D - Pacing / paragraph length
  q10: string; // A/B/C/D - Closing style
  q11: string; // A/B/C/D - Pidgin level
  q12: string; // A/B/C/D - Reference universe
  q13: string; // A/B/C/D - Edge level
  q14: string; // A/B/C/D - Reader relationship
  q15: string; // A/B/C/D - Core archetype
  q16?: string; // Aspirational writers (free text)
}

export interface WritingDNARequest {
  quiz_answers: QuizAnswers;
  writing_sample?: string; // Max 3000 chars
}

export interface WritingDNA {
  user_id: string;
  brand_id: string;
  profile: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// ── Blog Types ─────────────────────────────────────────────────────────

export interface BlogGenerationRequest {
  topic: string; // 5-200 chars
  primary_keyword: string; // 2-100 chars
  secondary_keywords?: string[]; // Max 10
  word_count?: number; // 300-3000, default: 800
}

export interface BlogPost {
  blog_id: string;
  user_id: string;
  brand_id: string;
  topic: string;
  primary_keyword: string;
  secondary_keywords: string[];
  generated_title: string;
  generated_content: string;
  word_count: number;
  status: 'draft' | 'published';
  published_url?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogUpdateRequest {
  content: string; // Min 50 chars
  title?: string; // Max 200 chars
}

export interface BlogFeedbackRequest {
  rating: 'up' | 'down';
  issues?: ('too_formal' | 'too_casual' | 'too_generic' | 'not_my_style')[];
}

export interface BlogPublishRequest {
  published_url?: string; // Max 500 chars
}

// ── Resource ───────────────────────────────────────────────────────────

export class BlogResource {
  constructor(private http: HTTPClient) {}

  // ── Writing DNA ─────────────────────────────────────────────────────

  /**
   * Submit Writing DNA quiz to generate personalized writing profile
   */
  async submitWritingDNAQuiz(request: WritingDNARequest): Promise<{ writing_dna: WritingDNA }> {
    return this.http.post<{ writing_dna: WritingDNA }>('/blog/writing-dna/quiz', request);
  }

  /**
   * Get current Writing DNA profile
   */
  async getWritingDNA(): Promise<{ writing_dna: WritingDNA | null }> {
    return this.http.get<{ writing_dna: WritingDNA | null }>('/blog/writing-dna');
  }

  // ── Blog Generation ─────────────────────────────────────────────────

  /**
   * Generate AI-powered blog post using Writing DNA
   */
  async generate(request: BlogGenerationRequest): Promise<{ blog_post: BlogPost }> {
    return this.http.post<{ blog_post: BlogPost }>('/blog/generate', request);
  }

  // ── Blog Management ─────────────────────────────────────────────────

  /**
   * List all blog posts
   */
  async listPosts(): Promise<{ blog_posts: BlogPost[] }> {
    return this.http.get<{ blog_posts: BlogPost[] }>('/blog/posts');
  }

  /**
   * Get specific blog post
   */
  async getPost(blogId: string): Promise<{ blog_post: BlogPost }> {
    return this.http.get<{ blog_post: BlogPost }>(`/blog/posts/${blogId}`);
  }

  /**
   * Update blog post (triggers voice learning)
   *
   * User edits are analyzed to improve future Writing DNA matching.
   */
  async updatePost(blogId: string, request: BlogUpdateRequest): Promise<{ blog_post: BlogPost }> {
    return this.http.patch<{ blog_post: BlogPost }>(`/blog/posts/${blogId}`, request);
  }

  /**
   * Submit thumbs-up/down feedback on blog post
   */
  async submitFeedback(blogId: string, request: BlogFeedbackRequest): Promise<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`/blog/posts/${blogId}/feedback`, request);
  }

  /**
   * Mark blog post as published
   */
  async publishPost(blogId: string, request?: BlogPublishRequest): Promise<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`/blog/posts/${blogId}/publish`, request || {});
  }
}

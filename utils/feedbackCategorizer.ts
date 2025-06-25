// Feedback categorization utility
export interface FeedbackCategory {
  overall: 'positive' | 'negative' | 'neutral';
  confidence: number; // 0-1, how confident we are in the categorization
  reasoning: string[];
}

export interface Question {
  id: number;
  questionText: string;
  questionType: 'RADIO' | 'RATING' | 'TEXT';
  options?: string[];
  required: boolean;
  departmentId: number;
}

// Define positive and negative keywords for text analysis
const POSITIVE_KEYWORDS = [
  'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'perfect', 'satisfied',
  'happy', 'pleased', 'impressed', 'helpful', 'caring', 'professional', 'clean', 'efficient',
  'quick', 'fast', 'timely', 'polite', 'friendly', 'kind', 'attentive', 'thorough'
];

const NEGATIVE_KEYWORDS = [
  'bad', 'terrible', 'awful', 'horrible', 'disappointed', 'unsatisfied', 'unhappy', 'angry',
  'frustrated', 'upset', 'poor', 'slow', 'dirty', 'unclean', 'rude', 'unprofessional',
  'unhelpful', 'uncaring', 'neglected', 'ignored', 'long wait', 'delayed', 'late'
];

// Radio option sentiment mapping
const RADIO_SENTIMENT_MAP: { [key: string]: number } = {
  // Positive options (score: 1)
  'yes': 1, 'yes, perfectly': 1, 'yes, very efficiently': 1, 'excellent': 1, 'very good': 1,
  'very satisfied': 1, 'very helpful': 1, 'very professional': 1, 'very clean': 1,
  
  // Slightly positive options (score: 0.6)
  'yes, somewhat': 0.6, 'somewhat efficiently': 0.6, 'good': 0.6, 'satisfied': 0.6,
  'helpful': 0.6, 'professional': 0.6, 'clean': 0.6, 'somewhat': 0.6,
  
  // Neutral options (score: 0.5)
  'neutral': 0.5, 'okay': 0.5, 'average': 0.5, 'moderate': 0.5,
  
  // Slightly negative options (score: 0.4)
  'no, not at all': 0.4, 'not very efficiently': 0.4, 'poor': 0.4, 'unsatisfied': 0.4,
  'unhelpful': 0.4, 'unprofessional': 0.4, 'dirty': 0.4, 'not very': 0.4,
  
  // Negative options (score: 0)
  'no': 0, 'not at all efficiently': 0, 'terrible': 0, 'very poor': 0, 'very unsatisfied': 0,
  'very unhelpful': 0, 'very unprofessional': 0, 'very dirty': 0
};

/**
 * Analyze text sentiment using keyword matching
 */
function analyzeTextSentiment(text: string): number {
  if (!text || typeof text !== 'string') return 0.5;
  
  const lowerText = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;
  
  POSITIVE_KEYWORDS.forEach(keyword => {
    if (lowerText.includes(keyword)) positiveCount++;
  });
  
  NEGATIVE_KEYWORDS.forEach(keyword => {
    if (lowerText.includes(keyword)) negativeCount++;
  });
  
  if (positiveCount === 0 && negativeCount === 0) return 0.5; // Neutral
  
  const total = positiveCount + negativeCount;
  return positiveCount / total; // Returns 0-1, where 1 is positive
}

/**
 * Categorize a single question answer
 */
function categorizeAnswer(question: Question, answer: any): { sentiment: number; confidence: number } {
  if (!answer || answer === '' || answer === null || answer === undefined) {
    return { sentiment: 0.5, confidence: 0.1 }; // Neutral with low confidence
  }
  
  switch (question.questionType) {
    case 'RATING':
      // Rating 0-5: 0-2 = negative, 3 = neutral, 4-5 = positive
      const rating = typeof answer === 'number' ? answer : parseFloat(answer);
      if (isNaN(rating)) return { sentiment: 0.5, confidence: 0.1 };
      
      if (rating <= 2) return { sentiment: 0.2, confidence: 0.9 };
      if (rating === 3) return { sentiment: 0.5, confidence: 0.8 };
      return { sentiment: 0.8, confidence: 0.9 };
      
    case 'RADIO':
      // Use predefined sentiment mapping
      const lowerAnswer = String(answer).toLowerCase();
      const sentiment = RADIO_SENTIMENT_MAP[lowerAnswer];
      if (sentiment !== undefined) {
        return { sentiment, confidence: 0.8 };
      }
      return { sentiment: 0.5, confidence: 0.3 }; // Unknown option
      
    case 'TEXT':
      // Analyze text sentiment
      const textSentiment = analyzeTextSentiment(String(answer));
      return { sentiment: textSentiment, confidence: 0.6 };
      
    default:
      return { sentiment: 0.5, confidence: 0.1 };
  }
}

/**
 * Categorize overall feedback based on all answers
 */
export function categorizeFeedback(
  questions: Question[],
  answers: { [key: number]: any },
  comment?: string,
  commentType?: string
): FeedbackCategory {
  const reasoning: string[] = [];
  let totalSentiment = 0;
  let totalConfidence = 0;
  let validAnswers = 0;
  
  // Analyze each question answer
  questions.forEach(question => {
    const answer = answers[question.id];
    const { sentiment, confidence } = categorizeAnswer(question, answer);
    
    if (confidence > 0.1) { // Only count answers we're confident about
      totalSentiment += sentiment * confidence;
      totalConfidence += confidence;
      validAnswers++;
      
      // Add reasoning
      if (sentiment > 0.7) {
        reasoning.push(`Positive response to: "${question.questionText}"`);
      } else if (sentiment < 0.3) {
        reasoning.push(`Negative response to: "${question.questionText}"`);
      }
    }
  });
  
  // Factor in comment sentiment if available
  if (comment) {
    const commentSentiment = analyzeTextSentiment(comment);
    const commentWeight = 0.3; // Comment has 30% weight
    totalSentiment = totalSentiment * (1 - commentWeight) + commentSentiment * commentWeight;
    totalConfidence = Math.min(totalConfidence + 0.2, 1); // Boost confidence with comment
    
    if (commentSentiment > 0.7) {
      reasoning.push('Positive comment provided');
    } else if (commentSentiment < 0.3) {
      reasoning.push('Negative comment provided');
    }
  }
  
  // Factor in comment type if available
  if (commentType) {
    const commentTypeWeight = 0.2; // Comment type has 20% weight
    let typeSentiment = 0.5;
    
    switch (commentType.toLowerCase()) {
      case 'compliment':
        typeSentiment = 0.9;
        reasoning.push('User selected compliment as comment type');
        break;
      case 'complaint':
        typeSentiment = 0.1;
        reasoning.push('User selected complaint as comment type');
        break;
      case 'suggestion':
        typeSentiment = 0.6; // Slightly positive
        reasoning.push('User selected suggestion as comment type');
        break;
    }
    
    totalSentiment = totalSentiment * (1 - commentTypeWeight) + typeSentiment * commentTypeWeight;
  }
  
  // Calculate overall sentiment
  const overallSentiment = validAnswers > 0 ? totalSentiment / Math.max(totalConfidence, 0.1) : 0.5;
  const confidence = Math.min(totalConfidence / Math.max(validAnswers, 1), 1);
  
  // Determine category
  let overall: 'positive' | 'negative' | 'neutral';
  if (overallSentiment >= 0.6) {
    overall = 'positive';
  } else if (overallSentiment <= 0.4) {
    overall = 'negative';
  } else {
    overall = 'neutral';
  }
  
  // Add overall reasoning
  if (reasoning.length === 0) {
    reasoning.push('Insufficient data for detailed analysis');
  }
  
  return {
    overall,
    confidence,
    reasoning
  };
}

/**
 * Get a human-readable summary of the categorization
 */
export function getCategorizationSummary(category: FeedbackCategory): string {
  const confidencePercent = Math.round(category.confidence * 100);
  
  switch (category.overall) {
    case 'positive':
      return `Positive feedback (${confidencePercent}% confidence)`;
    case 'negative':
      return `Negative feedback (${confidencePercent}% confidence)`;
    case 'neutral':
      return `Neutral feedback (${confidencePercent}% confidence)`;
    default:
      return 'Unable to categorize feedback';
  }
} 
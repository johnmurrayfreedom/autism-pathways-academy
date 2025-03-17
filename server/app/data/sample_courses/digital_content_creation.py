from app.schemas.sample_content import (
    SampleCourse,
    SampleModule,
    SampleLesson,
    ConceptReference,
    ResourceLink,
    LearningObjective,
    PracticeExercise,
)

# Key Concepts
content_planning_concept = ConceptReference(
    id="content_planning",
    name="Content Planning",
    description="A systematic approach to planning digital content that ensures clarity, consistency, and purpose.",
    related_concepts=["content_calendar", "audience_analysis", "content_types"],
    visual_aid_url="/images/content_planning_framework.svg"
)

accessibility_concept = ConceptReference(
    id="content_accessibility",
    name="Content Accessibility",
    description="Principles and practices for creating digital content that is accessible to all users, including those with different sensory preferences and processing styles.",
    related_concepts=["alt_text", "color_contrast", "clear_language"],
    visual_aid_url="/images/accessibility_checklist.svg"
)

writing_concept = ConceptReference(
    id="digital_writing",
    name="Digital Writing",
    description="Techniques for writing clear, engaging digital content that considers online reading patterns and accessibility needs.",
    example_code="""
# Example Blog Post Structure

## Clear Title That Describes the Content

### Introduction
- State the main topic
- Explain why it matters
- Preview what readers will learn

### Main Points (2-3 sections)
- Use clear headings
- Include specific examples
- Break text into short paragraphs

### Conclusion
- Summarize key points
- Provide next steps or call to action
- Include relevant resources
""",
    visual_aid_url="/images/digital_writing_patterns.svg"
)

# Sample Course
digital_content_course = SampleCourse(
    id=2,
    title="Digital Content Creation for Everyone",
    description="""
    Learn how to create engaging, accessible digital content that reaches and resonates with your audience. This course takes a structured approach to content creation, focusing on clear communication, systematic planning, and accessibility best practices.
    
    Perfect for beginners who want to start creating online content or anyone looking to make their existing content more accessible and effective.
    """,
    category_id=2,  # Digital Skills category
    target_audience=[
        "Beginning content creators",
        "Systematic thinkers who enjoy organizing information",
        "Detail-oriented individuals interested in digital communication",
        "People who want to make their content more accessible",
    ],
    prerequisites=[
        "Basic computer skills",
        "Interest in creating digital content",
        "No prior content creation experience required",
    ],
    learning_outcomes=[
        "Create structured, accessible digital content",
        "Plan and organize content effectively",
        "Write clear and engaging online text",
        "Apply accessibility best practices",
        "Use tools to enhance content creation",
    ],
    estimated_duration="4 weeks (2-3 hours per week)",
    difficulty_level="beginner",
    accessibility_features=[
        "Clear, step-by-step processes",
        "Visual planning templates",
        "Structured writing frameworks",
        "Alternative format examples",
        "Accessibility checklists",
        "Sensory consideration guides",
    ],
    support_resources=[
        ResourceLink(
            title="Web Content Accessibility Guidelines (WCAG)",
            url="https://www.w3.org/WAI/standards-guidelines/wcag/",
            description="Official guidelines for making web content accessible",
            type="documentation",
            difficulty_level="intermediate"
        ),
        ResourceLink(
            title="Plain Language Guidelines",
            url="https://www.plainlanguage.gov/guidelines/",
            description="Guidelines for writing clear, understandable content",
            type="documentation",
            difficulty_level="beginner"
        ),
    ],
    modules=[
        SampleModule(
            id=1,
            title="Content Planning and Organization",
            description="Learn systematic approaches to planning and organizing digital content.",
            order=1,
            course_id=2,
            prerequisites=[],
            learning_path=[
                "Understand content planning basics",
                "Create content calendars",
                "Develop content frameworks",
            ],
            module_objectives=[
                "Create structured content plans",
                "Organize content systematically",
                "Develop clear content goals",
            ],
            lessons=[
                SampleLesson(
                    id=1,
                    title="Systematic Content Planning",
                    description="Learn how to plan content in a structured, organized way.",
                    order=1,
                    module_id=1,
                    content="""
                    # Systematic Content Planning

                    Creating good digital content starts with careful planning. Let's break down the process into clear, manageable steps.

                    ## Why Plan Your Content?

                    Planning helps you:
                    - Stay organized and consistent
                    - Save time and reduce stress
                    - Create better quality content
                    - Maintain a regular schedule

                    ## The Content Planning Framework

                    Follow these steps for each piece of content:

                    1. **Define Your Purpose**
                       - What do you want to achieve?
                       - Who is it for?
                       - What should they learn or do?

                    2. **Choose Your Format**
                       - Blog post
                       - Video
                       - Social media post
                       - Infographic

                    3. **Create an Outline**
                       - Main topic
                       - Key points
                       - Supporting information
                       - Call to action

                    4. **Gather Resources**
                       - Research sources
                       - Images or graphics
                       - Examples
                       - Tools needed

                    ## Using a Content Calendar

                    A content calendar helps you:
                    - Plan ahead
                    - Stay consistent
                    - Track your progress
                    - Manage multiple pieces

                    ### Simple Calendar Template:

                    ```
                    Date | Topic | Format | Status | Notes
                    -----|-------|--------|--------|------
                    May 1| Intro | Blog   | Draft  | Include examples
                    May 3| Tips  | Video  | Plan   | Record tomorrow
                    ```

                    ## Making Your Plan Accessible

                    Consider these points:
                    - Include alternative formats
                    - Plan for different attention spans
                    - Consider sensory preferences
                    - Include accessibility checks
                    """,
                    video_url="https://example.com/content-planning",
                    learning_objectives=[
                        LearningObjective(
                            id="planning_basics",
                            description="Create structured content plans",
                            assessment_criteria=[
                                "Define clear content purposes",
                                "Create organized content outlines",
                                "Develop practical content calendars",
                            ],
                            concepts=[content_planning_concept]
                        )
                    ],
                    key_concepts=[
                        content_planning_concept,
                        ConceptReference(
                            id="content_calendar",
                            name="Content Calendar",
                            description="A systematic tool for planning and tracking content creation",
                            related_concepts=["content_planning"],
                            visual_aid_url="/images/calendar_template.svg"
                        )
                    ],
                    practice_exercises=[
                        PracticeExercise(
                            id="create_content_plan",
                            title="Create Your Content Plan",
                            description="Develop a structured plan for your first piece of content",
                            instructions=[
                                "Choose a topic you're interested in",
                                "Fill out the planning template",
                                "Create a basic content calendar",
                                "List required resources",
                            ],
                            starter_code="""
                            Content Planning Template

                            1. Purpose:
                               - Main goal:
                               - Target audience:
                               - Desired outcome:

                            2. Format:
                               - Type of content:
                               - Length/duration:
                               - Key features:

                            3. Outline:
                               - Main topic:
                               - Key points:
                               - Supporting details:
                               - Call to action:

                            4. Resources needed:
                               - Research:
                               - Media:
                               - Tools:
                            """,
                            hints=[
                                "Start with a topic you know well",
                                "Be specific about your goals",
                                "Think about your audience's needs",
                            ],
                            validation_points=[
                                "Clear purpose defined",
                                "Structured outline created",
                                "Resources identified",
                            ]
                        )
                    ],
                    additional_resources=[
                        ResourceLink(
                            title="Content Strategy Basics",
                            url="https://www.usability.gov/what-and-why/content-strategy.html",
                            description="Introduction to content strategy and planning",
                            type="article",
                            difficulty_level="beginner"
                        )
                    ]
                ),
                SampleLesson(
                    id=2,
                    title="Writing Clear Digital Content",
                    description="Learn techniques for writing clear, accessible digital content.",
                    order=2,
                    module_id=1,
                    content="""
                    # Writing Clear Digital Content

                    Good digital content is clear, organized, and easy to understand. Let's learn how to write content that works well for everyone.

                    ## Principles of Clear Writing

                    1. **Keep It Simple**
                       - Use clear, direct language
                       - Avoid jargon and complex terms
                       - Write short sentences
                       - Use active voice

                    2. **Structure Your Content**
                       - Start with the main point
                       - Use headings and subheadings
                       - Create short paragraphs
                       - Use bullet points and lists

                    3. **Make It Scannable**
                       - Use descriptive headings
                       - Highlight key points
                       - Include white space
                       - Break up long text

                    ## Writing Templates

                    ### Blog Post Template:
                    ```
                    Title: Clear and Descriptive

                    Introduction:
                    - Hook the reader
                    - State the purpose
                    - Preview the content

                    Main Sections:
                    1. First Key Point
       - Supporting details
       - Examples
       - Tips

                    2. Second Key Point
       - Supporting details
       - Examples
       - Tips

                    Conclusion:
                    - Summarize main points
                    - Call to action
                    - Next steps
                    ```

                    ## Accessibility Tips

                    1. **Use Clear Language**
                       - Write at a comfortable reading level
                       - Define technical terms
                       - Use consistent terminology

                    2. **Format for Accessibility**
                       - Use proper heading hierarchy
                       - Include alternative text for images
                       - Ensure good color contrast
                       - Provide text alternatives

                    3. **Check Your Work**
                       - Read it aloud
                       - Use accessibility checkers
                       - Get feedback
                       - Test with different devices
                    """,
                    video_url="https://example.com/clear-writing",
                    learning_objectives=[
                        LearningObjective(
                            id="writing_basics",
                            description="Write clear and accessible digital content",
                            assessment_criteria=[
                                "Use clear, direct language",
                                "Structure content effectively",
                                "Apply accessibility principles",
                            ],
                            concepts=[writing_concept]
                        )
                    ],
                    key_concepts=[
                        writing_concept,
                        accessibility_concept
                    ],
                    practice_exercises=[
                        PracticeExercise(
                            id="write_blog_post",
                            title="Write Your First Blog Post",
                            description="Create a clear, structured blog post using the template",
                            instructions=[
                                "Choose a topic from your content plan",
                                "Follow the blog post template",
                                "Apply clear writing principles",
                                "Include accessibility features",
                            ],
                            starter_code="""
                            [Title]

                            [Introduction]
                            - Main topic:
                            - Why it matters:
                            - What readers will learn:

                            [First Key Point]
                            - Main idea:
                            - Supporting details:
                            - Example:

                            [Second Key Point]
                            - Main idea:
                            - Supporting details:
                            - Example:

                            [Conclusion]
                            - Summary:
                            - Call to action:
                            - Next steps:
                            """,
                            hints=[
                                "Start with a clear outline",
                                "Use short paragraphs",
                                "Include specific examples",
                            ],
                            validation_points=[
                                "Clear structure used",
                                "Language is accessible",
                                "Includes all required sections",
                            ]
                        )
                    ],
                    additional_resources=[
                        ResourceLink(
                            title="Writing for the Web",
                            url="https://www.usability.gov/how-to-and-tools/methods/writing-for-the-web.html",
                            description="Guidelines for effective web writing",
                            type="article",
                            difficulty_level="beginner"
                        )
                    ]
                )
            ]
        )
    ]
)

# Add to sample courses
sample_courses["digital_content_creation"] = digital_content_course 
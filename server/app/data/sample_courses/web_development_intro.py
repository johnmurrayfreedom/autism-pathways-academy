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
html_concept = ConceptReference(
    id="html_basics",
    name="HTML",
    description="HTML (HyperText Markup Language) is the standard language for creating web pages. It uses tags to structure content.",
    example_code="""
<!DOCTYPE html>
<html>
  <head>
    <title>My First Webpage</title>
  </head>
  <body>
    <h1>Welcome!</h1>
    <p>This is a paragraph.</p>
  </body>
</html>
""",
    visual_aid_url="/images/html_structure.svg"
)

css_concept = ConceptReference(
    id="css_basics",
    name="CSS",
    description="CSS (Cascading Style Sheets) is used to style and layout web pages. It controls colors, fonts, spacing, and more.",
    example_code="""
/* Style a paragraph */
p {
    color: blue;
    font-size: 16px;
    margin: 10px;
}
""",
    visual_aid_url="/images/css_box_model.svg"
)

# Sample Course
web_dev_course = SampleCourse(
    id=1,
    title="Introduction to Web Development",
    description="""
    Learn the fundamentals of web development in a clear, structured way. This course is designed for beginners and focuses on practical, hands-on learning with step-by-step guidance.
    
    You'll start with the basics of how websites work and progress to creating your own simple web pages using HTML and CSS.
    """,
    category_id=1,  # Web Development category
    target_audience=[
        "Beginners interested in web development",
        "Visual thinkers who enjoy creating",
        "Detail-oriented learners who appreciate structure",
    ],
    prerequisites=[
        "Basic computer skills",
        "Ability to use a text editor",
        "No coding experience required",
    ],
    learning_outcomes=[
        "Create simple web pages using HTML",
        "Style web content using CSS",
        "Understand how websites work",
        "Build accessible web content",
    ],
    estimated_duration="4 weeks (2-3 hours per week)",
    difficulty_level="beginner",
    accessibility_features=[
        "Clear, direct language",
        "Step-by-step instructions",
        "Visual aids with text alternatives",
        "Keyboard navigation support",
        "High contrast code examples",
        "Multiple learning formats",
    ],
    support_resources=[
        ResourceLink(
            title="MDN Web Docs",
            url="https://developer.mozilla.org/",
            description="Comprehensive web development documentation with beginner guides",
            type="documentation",
            difficulty_level="beginner"
        ),
        ResourceLink(
            title="W3C Web Accessibility Initiative",
            url="https://www.w3.org/WAI/",
            description="Guidelines and resources for creating accessible web content",
            type="documentation",
            difficulty_level="beginner"
        ),
    ],
    modules=[
        SampleModule(
            id=1,
            title="Understanding the Web",
            description="Learn the fundamental concepts of how the web works and how websites are created.",
            order=1,
            course_id=1,
            prerequisites=[],
            learning_path=[
                "Understand what the web is",
                "Learn about web browsers and servers",
                "Explore HTML basics",
            ],
            module_objectives=[
                "Explain how the web works",
                "Identify key components of a website",
                "Create a simple HTML page",
            ],
            lessons=[
                SampleLesson(
                    id=1,
                    title="What is the Web?",
                    description="An introduction to the World Wide Web and how it works.",
                    order=1,
                    module_id=1,
                    content="""
                    # What is the Web?

                    The World Wide Web (or "the web" for short) is a way to view and share information over the internet. Think of it like a giant library where anyone can:
                    - Read information (visiting websites)
                    - Share information (creating websites)
                    - Connect with others (social media, email)

                    ## How Does It Work?

                    When you visit a website, here's what happens:

                    1. You type a web address (URL) in your browser
                    2. Your browser sends a request to a web server
                    3. The server sends back the website files
                    4. Your browser displays the website

                    It's like sending a letter to a library (your request) and getting books back (the website)!

                    ## Key Terms to Know

                    - **Browser**: A program that lets you view websites (like Chrome, Firefox, or Safari)
                    - **Website**: A collection of web pages with information
                    - **Web Server**: A computer that stores and shares website files
                    - **URL**: The address of a website (like www.example.com)

                    ## Why Is This Important?

                    Understanding how the web works helps you:
                    - Make better websites
                    - Solve problems when things go wrong
                    - Keep your information safe online
                    """,
                    video_url="https://example.com/intro-to-web",
                    learning_objectives=[
                        LearningObjective(
                            id="web_basics_1",
                            description="Understand and explain how the web works",
                            assessment_criteria=[
                                "Describe the client-server model",
                                "Explain what happens when visiting a website",
                                "Define key web terminology",
                            ],
                            concepts=[
                                ConceptReference(
                                    id="web_basics",
                                    name="Web Fundamentals",
                                    description="Basic concepts of how the web works",
                                    related_concepts=["browsers", "servers", "urls"],
                                    visual_aid_url="/images/web_diagram.svg"
                                )
                            ]
                        )
                    ],
                    key_concepts=[
                        ConceptReference(
                            id="browser",
                            name="Web Browser",
                            description="Software that retrieves and displays web pages",
                            related_concepts=["web_server", "url"],
                        ),
                        ConceptReference(
                            id="web_server",
                            name="Web Server",
                            description="Computer that stores and serves website files",
                            related_concepts=["browser", "url"],
                        )
                    ],
                    practice_exercises=[
                        PracticeExercise(
                            id="web_journey",
                            title="Map the Web Journey",
                            description="Create a step-by-step diagram of how a web page gets from a server to your browser",
                            instructions=[
                                "Draw or list the steps in order",
                                "Include the browser, server, and user",
                                "Label each step of the process",
                            ],
                            hints=[
                                "Start with the user typing a URL",
                                "Think about what the browser needs to do",
                                "Consider how the server responds",
                            ],
                            validation_points=[
                                "Includes all key steps",
                                "Steps are in correct order",
                                "Uses correct terminology",
                            ]
                        )
                    ],
                    additional_resources=[
                        ResourceLink(
                            title="How the Web Works",
                            url="https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works",
                            description="Detailed explanation with diagrams",
                            type="article",
                            difficulty_level="beginner"
                        )
                    ]
                ),
                SampleLesson(
                    id=2,
                    title="Introduction to HTML",
                    description="Learn the basics of HTML and create your first web page.",
                    order=2,
                    module_id=1,
                    content="""
                    # Introduction to HTML

                    HTML is the building block of every website. It's like creating a document with special labels that tell web browsers how to display your content.

                    ## What is HTML?

                    HTML stands for HyperText Markup Language. Let's break that down:
                    - **HyperText**: Text that links to other text
                    - **Markup**: Labels that tell browsers how to structure content
                    - **Language**: A set of rules for writing code

                    ## Basic HTML Structure

                    Every HTML page has this basic structure:

                    ```html
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <title>My Page Title</title>
                      </head>
                      <body>
                        <h1>Welcome!</h1>
                        <p>This is my first web page.</p>
                      </body>
                    </html>
                    ```

                    Let's understand each part:
                    1. `<!DOCTYPE html>`: Tells browsers this is an HTML document
                    2. `<html>`: Contains all other elements
                    3. `<head>`: Contains information about the page
                    4. `<title>`: Sets the page title (shows in browser tab)
                    5. `<body>`: Contains the visible content
                    6. `<h1>`: A main heading
                    7. `<p>`: A paragraph

                    ## Common HTML Elements

                    Here are some elements you'll use often:

                    - Headings: `<h1>` to `<h6>`
                    - Paragraphs: `<p>`
                    - Links: `<a href="url">link text</a>`
                    - Images: `<img src="image.jpg" alt="description">`
                    - Lists:
                      ```html
                      <ul>
                        <li>Unordered item</li>
                      </ul>
                      <ol>
                        <li>Ordered item</li>
                      </ol>
                      ```

                    ## Creating Your First Page

                    1. Open a text editor
                    2. Copy the basic structure above
                    3. Save it as "index.html"
                    4. Open it in a web browser

                    Remember:
                    - Always close your tags
                    - Use clear, descriptive content
                    - Include alt text for images
                    - Check your work in a browser
                    """,
                    video_url="https://example.com/html-basics",
                    learning_objectives=[
                        LearningObjective(
                            id="html_basics_1",
                            description="Create a simple HTML document",
                            assessment_criteria=[
                                "Write valid HTML structure",
                                "Use common HTML elements correctly",
                                "Include proper closing tags",
                            ],
                            concepts=[html_concept]
                        )
                    ],
                    key_concepts=[
                        html_concept,
                        ConceptReference(
                            id="html_elements",
                            name="HTML Elements",
                            description="The building blocks of HTML pages, including tags and attributes",
                            related_concepts=["html_basics"],
                            example_code="""
                            <p class="important">This is a paragraph</p>
                            <img src="photo.jpg" alt="A sunset">
                            """
                        )
                    ],
                    practice_exercises=[
                        PracticeExercise(
                            id="first_webpage",
                            title="Create Your First Webpage",
                            description="Build a simple personal introduction page using HTML",
                            instructions=[
                                "Create a new file named 'index.html'",
                                "Include all required HTML structure",
                                "Add a heading with your name",
                                "Write a paragraph about yourself",
                                "Add a list of your interests",
                            ],
                            starter_code="""
                            <!DOCTYPE html>
                            <html>
                              <head>
                                <title>About Me</title>
                              </head>
                              <body>
                                <!-- Add your content here -->
                              </body>
                            </html>
                            """,
                            hints=[
                                "Start with the main heading using <h1>",
                                "Use <p> for paragraphs",
                                "Try both <ul> and <ol> for lists",
                            ],
                            validation_points=[
                                "Has complete HTML structure",
                                "Includes heading, paragraph, and list",
                                "All tags are properly closed",
                            ]
                        )
                    ],
                    additional_resources=[
                        ResourceLink(
                            title="HTML Basics Guide",
                            url="https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics",
                            description="Comprehensive guide to HTML fundamentals",
                            type="article",
                            difficulty_level="beginner"
                        )
                    ]
                )
            ]
        ),
        SampleModule(
            id=2,
            title="Styling with CSS",
            description="Learn how to style your web pages using CSS.",
            order=2,
            course_id=1,
            prerequisites=["Basic HTML knowledge"],
            learning_path=[
                "Understand CSS syntax",
                "Learn about colors and fonts",
                "Master layouts and positioning",
            ],
            module_objectives=[
                "Write basic CSS rules",
                "Style text and colors",
                "Create simple layouts",
            ],
            lessons=[
                SampleLesson(
                    id=3,
                    title="CSS Basics",
                    description="Learn the fundamentals of CSS and how to style HTML elements.",
                    order=1,
                    module_id=2,
                    content="""
                    # CSS Basics: Making Web Pages Look Good

                    CSS (Cascading Style Sheets) is how we make web pages look attractive and organized. It's like choosing the colors, fonts, and layout for your content.

                    ## How CSS Works

                    CSS works by:
                    1. Selecting HTML elements
                    2. Setting style properties
                    3. Applying those styles to the elements

                    ## CSS Syntax

                    Here's the basic pattern:
                    ```css
                    selector {
                        property: value;
                    }
                    ```

                    For example:
                    ```css
                    p {
                        color: blue;
                        font-size: 16px;
                        margin: 10px;
                    }
                    ```

                    This means:
                    - Find all `<p>` elements
                    - Make the text blue
                    - Set text size to 16 pixels
                    - Add 10 pixels of space around them

                    ## Common Properties

                    ### Text Styling
                    ```css
                    h1 {
                        color: #333333;
                        font-family: Arial, sans-serif;
                        font-size: 24px;
                        text-align: center;
                    }
                    ```

                    ### Box Model
                    ```css
                    div {
                        margin: 10px;      /* Space outside */
                        padding: 15px;     /* Space inside */
                        border: 1px solid black;
                        width: 200px;
                        height: 100px;
                    }
                    ```

                    ### Colors
                    You can specify colors in different ways:
                    ```css
                    .example {
                        color: red;                /* Color name */
                        background: #FF0000;       /* Hex code */
                        border-color: rgb(255,0,0); /* RGB values */
                    }
                    ```

                    ## Adding CSS to HTML

                    Three ways to add CSS:

                    1. **Internal CSS** (in the HTML file):
                       ```html
                       <head>
                         <style>
                           p { color: blue; }
                         </style>
                       </head>
                       ```

                    2. **External CSS** (separate file):
                       ```html
                       <head>
                         <link rel="stylesheet" href="styles.css">
                       </head>
                       ```

                    3. **Inline CSS** (directly on elements):
                       ```html
                       <p style="color: blue;">Blue text</p>
                       ```

                    Best practice: Use external CSS files to keep your styles organized and reusable.

                    ## Tips for Success

                    - Start with a CSS reset or normalize
                    - Use meaningful class names
                    - Keep your CSS organized
                    - Test on different browsers
                    - Use comments to explain complex styles
                    """,
                    video_url="https://example.com/css-basics",
                    learning_objectives=[
                        LearningObjective(
                            id="css_basics_1",
                            description="Write and apply basic CSS styles",
                            assessment_criteria=[
                                "Write valid CSS syntax",
                                "Apply styles to HTML elements",
                                "Use different types of selectors",
                            ],
                            concepts=[css_concept]
                        )
                    ],
                    key_concepts=[
                        css_concept,
                        ConceptReference(
                            id="css_selectors",
                            name="CSS Selectors",
                            description="Ways to target HTML elements for styling",
                            related_concepts=["css_basics"],
                            example_code="""
                            /* Element selector */
                            p { color: blue; }

                            /* Class selector */
                            .highlight { background: yellow; }

                            /* ID selector */
                            #header { font-size: 24px; }
                            """
                        )
                    ],
                    practice_exercises=[
                        PracticeExercise(
                            id="style_webpage",
                            title="Style Your Webpage",
                            description="Add CSS styles to your personal introduction page",
                            instructions=[
                                "Create a new file named 'styles.css'",
                                "Link it to your HTML file",
                                "Style the heading and paragraphs",
                                "Add colors and spacing",
                                "Style your list items",
                            ],
                            starter_code="""
                            /* Add your styles here */
                            body {
                              font-family: Arial, sans-serif;
                            }

                            h1 {
                              /* Style your heading */
                            }

                            p {
                              /* Style your paragraphs */
                            }
                            """,
                            hints=[
                                "Use margin and padding for spacing",
                                "Try different font sizes",
                                "Experiment with colors",
                            ],
                            validation_points=[
                                "CSS is properly linked to HTML",
                                "Styles are applied correctly",
                                "Layout is well-organized",
                            ]
                        )
                    ],
                    additional_resources=[
                        ResourceLink(
                            title="CSS Basics Guide",
                            url="https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps",
                            description="Complete guide to getting started with CSS",
                            type="article",
                            difficulty_level="beginner"
                        )
                    ]
                )
            ]
        )
    ]
)

# Export the sample course
sample_courses = {
    "web_development_intro": web_dev_course
} 
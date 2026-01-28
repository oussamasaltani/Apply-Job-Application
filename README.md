# Job Application

A modern, responsive job application form built with HTML, CSS, and Vanilla JavaScript. Features smooth animations, real-time validation, and a premium user experience.

## 🚀 Features

### 🎨 Design & UX
- **Modern UI Design**: Clean, professional interface with card-based layout
- **Dark/Light Theme Toggle**: Switch between themes with smooth transitions
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile devices
- **Smooth Animations**: Page load animations, scroll reveals, and micro-interactions
- **Unified Phone Input**: Country code and phone number in a single, merged field
- **Subtle Validation Borders**: 1px borders with soft glow effects for better UX
- **Consistent Accessibility**: ARIA attributes and keyboard navigation support

### 📝 Form Features
- **Real-time Validation**: Instant feedback with visual indicators and error messages
- **Smart Input Fields**: Icons, placeholders, and validation states
- **Skills Management**: Add/remove skills with autocomplete suggestions
- **File Upload**: PDF-only CV upload with validation
- **Character Counter**: Live count for cover letter (800 char limit)
- **Experience Slider**: Interactive range slider for years of experience

### 🔧 Technical Features
- **Accessibility**: ARIA attributes, keyboard navigation, screen reader support
- **Local Storage**: Saves name and email for future visits
- **Form Preview**: Review application before submission
- **Loading States**: Visual feedback during form submission
- **Success Modal**: Confirmation after successful submission

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and form elements
- **CSS3**: Custom properties, flexbox, grid, animations
- **Vanilla JavaScript**: DOM manipulation, event handling, validation
- **Font Awesome**: Icons via CDN
- **Google Fonts**: Inter font family for typography
- **Intersection Observer**: Scroll-based animations

## 📁 Project Structure

```
job-application/
├── index.html          # Main HTML file
├── style.css           # Styles and animations
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs locally

### Installation
1. **Clone or download** the project files
2. **Open `index.html`** in your web browser
3. **Start filling out** the job application form

### Usage
1. **Theme Toggle**: Click the moon/sun icon in the top-right to switch themes
2. **Fill Form**: Complete all required fields with real-time validation
3. **Add Skills**: Type skills and press Enter, or select from suggestions
4. **Upload CV**: Select a PDF file only
5. **Preview**: Click "Preview Application" to review before submitting
6. **Submit**: Click "Submit Application" when all fields are valid

## 🎯 Key Components

### Form Validation
- **Required Fields**: Name, Email, Phone, CV, Cover Letter
- **Email Format**: Proper email validation
- **Phone Format**: Numeric validation with formatting
- **File Type**: PDF-only validation for CV uploads
- **Character Limits**: Cover letter minimum 100 characters

### Interactive Elements
- **Accordion**: Expandable job details sections
- **Progress Bar**: Sticky navigation showing current section
- **Skills Tags**: Removable skill badges
- **Modal Windows**: Preview and success confirmation

### Animations & Effects
- **Page Load**: Fade-in animations for sections
- **Scroll Reveal**: Elements animate into view
- **Hover Effects**: Button lifts and icon scaling
- **Focus States**: Input glow effects
- **Loading Spinner**: Animated submission feedback

## 🎨 Customization

### Theme Colors
Edit CSS variables in `:root` and `[data-theme="dark"]`:
```css
--primary-color: #00D4ff
--bg: #f9fafb;
--card: #ffffff;
--text: #111827;
--muted: #6b7280;
--border: #e5e7eb;
--error: #ef4444;
--success: #10b981;
```

### Form Fields
Add new fields by:
1. Adding HTML input elements
2. Updating validation in `validateField()` function
3. Adding to `requiredFields` array if needed

### Skills Suggestions
Modify the `suggestions` array in `initSkillsInput()` to add/remove skill options.

## 🔧 Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## 📱 Responsive Breakpoints

- **Desktop**: > 768px
- **Tablet**: 480px - 768px
- **Mobile**: < 480px

## 🐛 Known Issues

- iOS Safari may zoom on form focus (prevented with `font-size: 16px`)
- Some older browsers may not support CSS custom properties

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

For questions or issues:
- Check browser console for errors
- Ensure all files are in the same directory
- Verify Font Awesome CDN connection

---

**Built with ❤️ using modern web technologies**

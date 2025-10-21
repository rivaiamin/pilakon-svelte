# Task Templates - Pilakon Development

## Overview
This document provides reusable templates for different types of development tasks to ensure consistency and context preservation across the project.

**PRD Reference:** [docs/PRD.md](./docs/PRD.md)  
**Last Updated:** January 2025

---

## Template 1: Feature Implementation Task

```markdown
## Task: [Feature Name]
**Epic:** [Epic Name]  
**PRD Reference:** Section [X.X]  
**Priority:** [High/Medium/Low]  
**Estimated Effort:** [X hours/days]  
**Dependencies:** [List dependencies]

### Pre-Development Checklist
- [ ] PRD section reviewed: [Section reference]
- [ ] User personas considered: [Which personas - Sarah/Mike/Alex]
- [ milestones] Technical requirements noted: [List key requirements]
- [ ] Dependencies identified: [List dependencies]
- [ ] Performance impact assessed: [Notes]
- [ ] Accessibility requirements reviewed: [WCAG 2.1 AA items]

### Context from PRD
**Requirements:**
- [List specific requirements from PRD]

**User Stories:**
- [List relevant user stories]

**Technical Constraints:**
- [List technical constraints and considerations]

### Implementation Plan
1. **Setup Phase**
   - [ ] Environment preparation
   - [ ] Dependencies installation
   - [ ] Database schema updates (if needed)
   - [ ] Test environment setup

2. **Core Implementation**
   - [ ] Feature development
   - [ ] Integration with existing systems
   - [ ] Error handling implementation
   - [ ] Data validation

3. **Quality Assurance**
   - [ ] Unit testing
   - [ ] Integration testing
   - [ ] Performance testing
   - [ ] Accessibility testing
   - [ ] Cross-browser testing

### Post-Development Checklist
- [ ] PRD requirements verified
- [ ] Performance metrics checked (< 3s page load, < 5s TTI)
- [ ] Documentation updated
- [ ] Code review completed
- [ ] User acceptance criteria met
- [ ] Accessibility compliance verified (WCAG 2.1 AA)

### Success Criteria
- [ ] Feature meets all PRD requirements
- [ ] Performance targets achieved
- [ ] User experience validated with personas
- [ ] Code quality standards met
- [ ] Documentation complete

### Notes & Decisions
- [Decision logs and technical trade-offs]
- [Future considerations]
- [Lessons learned]
```

---

## Template 2: Database Schema Task

```markdown
## Task: [Database Feature Name]
**Epic:** [Epic Name]  
**PRD Reference:** Section [X.X]  
**Priority:** [High/Medium/Low]  
**Type:** Database Schema/Migration

### Pre-Development Checklist
- [ ] PRD requirements reviewed for data needs
- [ ] Security requirements identified (RLS policies)
- [ ] Performance implications considered
- [ ] Data relationships mapped
- [ ] Migration strategy planned

### Schema Requirements (from PRD)
**Data Structure:**
- [Describe data structure needed]

**Relationships:**
- [Describe relationships with other tables]

**Security:**
- [Describe RLS policy requirements]

### Implementation Plan
1. **Schema Design**
   - [ ] Table structure definition
   - [ ] Column types and constraints
   - [ ] Indexes for performance
   - [ ] Foreign key relationships

2. **Security Setup**
   - [ ] RLS policies creation
   - [ ] User permissions setup
   - [ ] Data validation rules

3. **Migration**
   - [ ] Migration script creation
   - [ ] Data migration (if needed)
   - [ ] Rollback plan preparation

### Quality Gates
- [ ] Schema follows Supabase best practices
- [ ] RLS policies properly implemented
- [ ] Performance indexes created
- [ ] Data validation working
- [ ] Migration tested successfully

### Success Criteria
- [ ] Database schema supports all PRD requirements
- [ ] Security policies protect user data
- [ ] Performance meets requirements
- [ ] Migration completed without data loss
- [ ] Documentation updated

### Notes & Decisions
- [Schema design decisions]
- [Performance considerations]
- [Security trade-offs]
```

---

## Template 3: UI Component Task

```markdown
## Task: [Component Name]
**Epic:** [Epic Name]  
**PRD Reference:** Section [X.X]  
**Priority:** [High/Medium/Low]  
**Type:** UI Component

### Pre-Development Checklist
- [ ] PRD UI requirements reviewed
- [ ] User personas considered for UX
- [ ] Accessibility requirements noted
- [ ] Antive breakpoints identified
- [ ] Component props/API designed

### Design Requirements (from PRD)
**Functionality:**
- [List component functionality]

**User Experience:**
- [List UX requirements]

**Accessibility:**
- [List accessibility requirements]

**Responsive Design:**
- [List responsive requirements]

### Implementation Plan
1. **Component Structure**
   - [ ] Svelte component creation
   - [ ] Props interface definition
   - [ ] Event handling setup
   - [ ] State management

2. **Styling**
   - [ ] Tailwind CSS classes
   - [ ] Responsive design implementation
   - [ ] Dark mode support (if needed)
   - [ ] Animation/transition setup

3. **Functionality**
   - [ ] Core feature implementation
   - [ ] Error handling
   - [ ] Loading states
   - [ ] Accessibility features

### Quality Gates
- [ ] Component works across all breakpoints
- [ ] Accessibility compliance verified
- [ ] Performance optimized
- [ ] Cross-browser compatibility
- [ ] User experience validated

### Success Criteria
- [ ] Component meets PRD requirements
- [ ] Responsive design works perfectly
- [ ] Accessibility standards met
- [ ] Performance targets achieved
- [ ] User experience validated with personas

### Notes & Decisions
- [Design decisions]
- [Accessibility considerations]
- [Performance optimizations]
```

---

## Template 4: API Integration Task

```markdown
## Task: [API Feature Name]
**Epic:** [Epic Name]  
**PRD Reference:** Section [X.X]  
**Priority:** [High/Medium/Low]  
**Type:** API Integration

### Pre-Development Checklist
- [ ] PRD API requirements reviewed
- [ ] Supabase client setup verified
- [ ] Authentication requirements identified
- [ ] Error handling strategy planned
- [ ] Performance implications considered

### API Requirements (from PRD)
**Endpoints:**
- [List required API endpoints]

**Data Flow:**
- [Describe data flow requirements]

**Security:**
- [Describe authentication/authorization needs]

### Implementation Plan
1. **API Setup**
   - [ ] Supabase client configuration
   - [ ] Authentication integration
   - [ ] Error handling setup
   - [ ] Loading states management

2. **Data Operations**
   - [ ] CRUD operations implementation
   - [ ] Data validation
   - [ ] Real-time subscriptions (if needed)
   - [ ] Caching strategy

3. **Integration**
   - [ ] Frontend integration
   - [ ] Error boundary implementation
   - [ ] Performance optimization
   - [ ] Testing setup

### Quality Gates
- [ ] API calls are secure and authenticated
- [ ] Error handling works correctly
- [ ] Performance meets requirements
- [ ] Real-time features work reliably
- [ ] Data validation prevents errors

### Success Criteria
- [ ] API integration supports all PRD requirements
- [ ] Security policies enforced
- [ ] Performance targets achieved
- [ ] Error handling provides good UX
- [ ] Real-time features work smoothly

### Notes & Decisions
- [API design decisions]
- [Security considerations]
- [Performance optimizations]
```

---

## Template 5: Performance Optimization Task

```markdown
## Task: [Performance Feature Name]
**Epic:** [Epic Name]  
**PRD Reference:** Performance Requirements  
**Priority:** [High/Medium/Low]  
**Type:** Performance Optimization

### Pre-Development Checklist
- [ ] PRD performance targets reviewed
- [ ] Current performance baseline measured
- [ ] Bottlenecks identified
- [ ] Optimization strategy planned
- [ ] Testing approach defined

### Performance Requirements (from PRD)
**Targets:**
- Page Load: < 3 seconds
- Time to Interactive: < 5 seconds
- Lighthouse Score: > 90
- Core Web Vitals: All green
- Mobile Performance: Optimized for 3G networks

### Current Performance Issues
- [List identified performance issues]

### Implementation Plan
1. **Analysis**
   - [ ] Performance profiling
   - [ ] Bottleneck identification
   - [ ] Resource usage analysis
   - [ ] User experience impact assessment

2. **Optimization**
   - [ ] Code optimization
   - [ ] Asset optimization
   - [ ] Caching implementation
   - [ ] Lazy loading setup

3. **Testing**
   - [ ] Performance testing
   - [ ] Load testing
   - [ ] Mobile performance testing
   - [ ] Lighthouse score verification

### Quality Gates
- [ ] All PRD performance targets met
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals all green
- [ ] Mobile performance optimized
- [ ] User experience improved

### Success Criteria
- [ ] Performance targets achieved
- [ ] User experience significantly improved
- [ ] Mobile performance optimized
- [ ] Lighthouse score > 90
- [ ] Performance monitoring setup

### Notes & Decisions
- [Optimization strategies]
- [Trade-offs made]
- [Future considerations]
```

---

## Template 6: Accessibility Task

```markdown
## Task: [Accessibility Feature Name]
**Epic:** [Epic Name]  
**PRD Reference:** Accessibility Requirements  
**Priority:** [High/Medium/Low]  
**Type:** Accessibility Implementation

### Pre-Development Checklist
- [ ] PRD accessibility requirements reviewed
- [ ] WCAG 2.1 AA compliance requirements noted
- [ ] Screen reader testing planned
- [ ] Keyboard navigation requirements identified
- [ ] Color contrast requirements reviewed

### Accessibility Requirements (from PRD)
**Standards:**
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Reduced motion support

### Implementation Plan
1. **Semantic HTML**
   - [ ] Proper HTML structure
   - [ ] ARIA labels and roles
   - [ ] Form accessibility
   - [ ] Navigation accessibility

2. **Keyboard Support**
   - [ ] Tab navigation
   - [ ] Focus management
   - [ ] Keyboard shortcuts
   - [ ] Skip links

3. **Visual Accessibility**
   - [ ] Color contrast compliance
   - [ ] Text scaling support
   - [ ] Reduced motion support
   - [ ] High contrast mode

### Quality Gates
- [ ] WCAG 2.1 AA compliance verified
- [ ] Screen reader testing passed
- [ ] Keyboard navigation works
- [ ] Color contrast meets standards
- [ ] Accessibility audit completed

### Success Criteria
- [ ] All accessibility requirements met
- [ ] Screen reader compatibility verified
- [ ] Keyboard navigation fully functional
- [ ] Color contrast compliance achieved
- [ ] Accessibility documentation complete

### Notes & Decisions
- [Accessibility design decisions]
- [Testing approaches]
- [Compliance considerations]
```

---

## Template 7: Testing Task

```markdown
## Task: [Testing Feature Name]
**Epic:** [Epic Name]  
**PRD Reference:** Section [X.X]  
**Priority:** [High/Medium/Low]  
**Type:** Testing Implementation

### Pre-Development Checklist
- [ ] PRD requirements reviewed for testing needs
- [ ] Test scenarios identified
- [ ] Test data prepared
- [ ] Testing environment setup
- [ ] Acceptance criteria defined

### Testing Requirements (from PRD)
**Test Types:**
- [List required test types]

**Acceptance Criteria:**
- [List acceptance criteria]

**Performance Requirements:**
- [List performance testing needs]

### Implementation Plan
1. **Test Setup**
   - [ ] Test environment configuration
   - [ ] Test data preparation
   - [ ] Testing tools setup
   - [ ] Test automation setup

2. **Test Execution**
   - [ ] Unit testing
   - [ ] Integration testing
   - [ ] End-to-end testing
   - [ ] Performance testing

3. **Test Validation**
   - [ ] Test results analysis
   - [ ] Bug reporting
   - [ ] Test coverage verification
   - [ ] Documentation update

### Quality Gates
- [ ] All tests pass
- [ ] Test coverage meets requirements
- [ ] Performance tests pass
- [ ] Accessibility tests pass
- [ ] User acceptance criteria met

### Success Criteria
- [ ] All PRD requirements tested
- [ ] Test coverage adequate
- [ ] Performance targets verified
- [ ] User experience validated
- [ ] Test documentation complete

### Notes & Decisions
- [Testing strategies]
- [Test coverage decisions]
- [Quality considerations]
```

---

## Usage Guidelines

### When to Use Each Template
1. **Feature Implementation**: For new features and functionality
2. **Database Schema**: For database changes and migrations
3. **UI Component**: For frontend components and interfaces
4. **API Integration**: For backend API and data operations
5. **Performance Optimization**: For performance improvements
6. **Accessibility**: For accessibility compliance work
7. **Testing**: For testing implementation and validation

### Template Customization
- Adapt templates based on specific task requirements
- Add or remove checklist items as needed
- Include additional context specific to your task
- Update success criteria based on PRD requirements

### Quality Assurance
- Always reference PRD sections in tasks
- Include user persona considerations
- Verify performance and accessibility requirements
- Document decisions and trade-offs

---
**Document Status:** Active Development  
**Next Review:** As needed during development  
**Maintained By:** Development Team

# Seamstress Skills Framework - Test Suite

## Overview

This test suite validates that the Seamstress skills framework has been successfully migrated from a router-based system to Claude Code's native semantic skills discovery.

## Test Environment Setup

1. Ensure you're in the Seamstress project directory
2. Have Claude Code CLI active
3. No active conversation history (start fresh for accurate testing)

## Phase 1: Skills Discovery Tests

### Test 1.1: Core Skills Discovery

**Objective**: Verify Claude can discover and cite core principles

**Test Cases**:

1. **Golden Rules Discovery**
   ```
   Prompt: "What are the Seamstress golden rules?"
   Expected: Claude cites seamstress-core-principles skill
   Success Criteria:
   - Mentions PageHeaderComposable requirement
   - Mentions theme tokens only
   - Mentions entity-scoped routes
   - References the skill by name
   ```

2. **Component Hierarchy Discovery**
   ```
   Prompt: "What's the component priority hierarchy in Seamstress?"
   Expected: Claude cites seamstress-component-hierarchy skill
   Success Criteria:
   - Mentions Priority 1: OpenGov → Priority 2: MUI → Priority 3: Custom
   - Provides decision tree
   - References the skill by name
   ```

### Test 1.2: Domain Skills Discovery

**Test Cases**:

1. **Routing Patterns**
   ```
   Prompt: "How do entity-scoped routes work?"
   Expected: Claude cites seamstress-routing-patterns skill
   Success Criteria:
   - Explains /entity/{entityId}/resource pattern
   - Shows navigation examples
   - References the skill by name
   ```

2. **Business Logic Patterns**
   ```
   Prompt: "How do I fetch data with Effect.ts in Seamstress?"
   Expected: Claude cites seamstress-business-logic skill
   Success Criteria:
   - Shows Effect.ts pattern
   - Mentions abort controllers
   - Includes error handling
   - References the skill by name
   ```

3. **Theme System**
   ```
   Prompt: "How do I customize colors in Seamstress?"
   Expected: Claude cites seamstress-theme-system skill
   Success Criteria:
   - Mentions design tokens
   - Shows theme.palette.* usage
   - Warns against hardcoded values
   - References the skill by name
   ```

4. **Figma Integration**
   ```
   Prompt: "How do I validate my component against Figma?"
   Expected: Claude cites seamstress-figma-integration skill
   Success Criteria:
   - Lists validation checklist (layout, spacing, etc.)
   - Mentions 8px grid
   - Emphasizes design tokens
   - References the skill by name
   ```

5. **Architecture**
   ```
   Prompt: "Explain the Seamstress architecture layers"
   Expected: Claude cites seamstress-architecture skill
   Success Criteria:
   - Shows layer hierarchy (MUI → Capital → Seamstress)
   - Explains build resolution
   - References the skill by name
   ```

6. **Accessibility**
   ```
   Prompt: "What are the accessibility requirements for Seamstress?"
   Expected: Claude cites seamstress-accessibility skill
   Success Criteria:
   - Mentions WCAG 2.1 AA
   - Lists color contrast requirements
   - Emphasizes keyboard accessibility
   - References the skill by name
   ```

### Test 1.3: Pattern Skills Discovery

**Test Cases**:

1. **List View Pattern**
   ```
   Prompt: "Explain the list view pattern in Seamstress"
   Expected: Claude cites list-view-pattern skill
   Success Criteria:
   - Shows DataGrid structure
   - Mentions 4 states (loading, error, empty, success)
   - Includes PageHeaderComposable
   - References the skill by name
   ```

2. **Form Pattern**
   ```
   Prompt: "How do I build a form in Seamstress?"
   Expected: Claude cites form-pattern skill
   Success Criteria:
   - Shows form structure with validation
   - Mentions isDirty flag
   - Includes unsaved changes warning
   - References the skill by name
   ```

3. **Detail View Pattern**
   ```
   Prompt: "Show me the detail view pattern"
   Expected: Claude cites detail-view-pattern skill
   Success Criteria:
   - Shows read-only layout
   - Includes edit/delete buttons
   - Mentions confirmation dialog
   - References the skill by name
   ```

4. **Dashboard Pattern**
   ```
   Prompt: "How do I build a dashboard in Seamstress?"
   Expected: Claude cites dashboard-pattern skill
   Success Criteria:
   - Shows metric card pattern
   - Mentions responsive grid
   - Includes aggregated data
   - References the skill by name
   ```

## Phase 2: Skill Composition Tests

### Test 2.1: Multi-Skill Requests

**Test Cases**:

1. **Cross-Domain Request**
   ```
   Prompt: "How do I build a list view with proper routing and theme tokens?"
   Expected: Claude composes multiple skills:
   - list-view-pattern (component structure)
   - seamstress-routing-patterns (navigation)
   - seamstress-theme-system (styling)
   Success Criteria:
   - References all relevant skills
   - Provides integrated answer
   - Shows how skills work together
   ```

2. **Pattern + Principles**
   ```
   Prompt: "Build a skills list page following Seamstress best practices"
   Expected: Claude composes:
   - list-view-pattern (structure)
   - seamstress-core-principles (validation)
   - seamstress-component-hierarchy (imports)
   Success Criteria:
   - PageHeaderComposable present
   - Correct import order
   - Entity-scoped routes
   - Theme tokens only
   ```

## Phase 3: Practical Application Tests

### Test 3.1: Component Generation

**Test Case: Generate List Page**
```
Prompt: "Generate a complete skills list page for entity-scoped context with search and 20 mock items"

Expected Behavior:
1. Claude loads relevant skills:
   - list-view-pattern
   - seamstress-core-principles
   - seamstress-routing-patterns
   - seamstress-component-hierarchy

2. Generated code includes:
   - PageHeaderComposable with title and Create button
   - Search TextField with proper spacing
   - DataGrid with columns
   - All 4 states (loading, error, empty, success)
   - Entity-scoped routes: /entity/${entityId}/skills
   - Theme tokens (p: 2, not padding: '16px')
   - OpenGov imports before MUI imports
   - Mock data generation

3. Validation checklist satisfied:
   - No hardcoded colors/spacing
   - Proper import order
   - TypeScript types
   - All required props
```

**Validation Steps**:
1. Read generated code
2. Verify PageHeaderComposable present
3. Check for hardcoded values (should be NONE)
4. Verify import order (React → OpenGov → MUI → Local)
5. Confirm entity-scoped routes
6. Check all 4 states implemented

### Test 3.2: Form Generation

**Test Case: Generate Form Page**
```
Prompt: "Generate a form for creating/editing agents with validation"

Expected Behavior:
1. Claude loads:
   - form-pattern
   - seamstress-core-principles
   - seamstress-business-logic

2. Generated code includes:
   - PageHeaderComposable with Save/Cancel
   - Form fields with validation
   - isDirty tracking
   - Error messages per field
   - Unsaved changes warning
   - Entity-scoped routes
   - Theme tokens

Validation Steps:
1. Verify validation logic present
2. Check isDirty flag used
3. Confirm unsaved changes warning
4. Verify no hardcoded values
```

### Test 3.3: Advice/Guidance Tests

**Test Case: Theme Customization Advice**
```
Prompt: "I want to add a custom status color for 'pending' items"

Expected Behavior:
1. Claude references seamstress-theme-system
2. Advises to extend palette in src/theme/theme.ts
3. Shows using capitalDesignTokens for color value
4. Warns against hardcoded hex values
5. Explains why override is needed

Success Criteria:
- Cites theme-system skill
- Provides code example
- Emphasizes design token usage
- Minimal override philosophy
```

## Phase 4: Token Efficiency Tests

### Test 4.1: Measure Context Size

**Baseline (Old System)**:
- Full seamstress-router agent: ~4K tokens
- Plus specialized agent: ~6.5K tokens
- Total: ~10.5K tokens per request

**New System Target**:
- Core skills (1-2): ~2-3K tokens
- Domain skill (1-2): ~1.5-3K tokens
- Pattern skill (1): ~2K tokens
- Total target: <7K tokens average

**Test Process**:
1. Clear conversation history
2. Make request: "Build a skills list page"
3. Note which skills Claude loaded
4. Estimate total context (very rough estimate based on skill sizes)
5. Verify < 8K tokens loaded

**Success Criteria**: Skills loaded are focused and relevant, no unnecessary context

## Phase 5: Skill Cross-Reference Tests

### Test 5.1: Skill Relationships

**Test Cases**:

1. **Core → Pattern Reference**
   ```
   Prompt: "Show me the list view pattern"
   Expected:
   - Claude loads list-view-pattern
   - Pattern references core-principles (should mention it)
   - Pattern references component-hierarchy (for imports)
   Success: Skills acknowledge their dependencies
   ```

2. **Pattern → Domain Reference**
   ```
   Prompt: "Build a list with proper routing"
   Expected:
   - Claude loads list-view-pattern
   - Claude also loads routing-patterns
   - Answer integrates both skills
   Success: Skills compose naturally
   ```

## Phase 6: Edge Cases & Error Handling

### Test 6.1: Ambiguous Requests

**Test Case**:
```
Prompt: "Help me with Seamstress"

Expected Behavior:
- Claude asks clarifying questions
- OR suggests multiple relevant skills
- Does not load all skills at once

Success: Claude is selective about skill loading
```

### Test 6.2: Conflicting Information

**Test Case**:
```
Prompt: "Can I use hardcoded colors in Seamstress?"

Expected Behavior:
- Claude cites core-principles
- Clear "NO" answer
- Explains why (design tokens requirement)
- Shows correct alternative

Success: Skills provide authoritative guidance
```

## Test Results Template

Use this template to record test results:

```
## Test Execution: [Date]

### Phase 1: Skills Discovery
- [ ] Test 1.1.1: Golden Rules - PASS/FAIL
- [ ] Test 1.1.2: Component Hierarchy - PASS/FAIL
- [ ] Test 1.2.1: Routing Patterns - PASS/FAIL
- [ ] Test 1.2.2: Business Logic - PASS/FAIL
- [ ] Test 1.2.3: Theme System - PASS/FAIL
- [ ] Test 1.2.4: Figma Integration - PASS/FAIL
- [ ] Test 1.2.5: Architecture - PASS/FAIL
- [ ] Test 1.2.6: Accessibility - PASS/FAIL
- [ ] Test 1.3.1: List View Pattern - PASS/FAIL
- [ ] Test 1.3.2: Form Pattern - PASS/FAIL
- [ ] Test 1.3.3: Detail View Pattern - PASS/FAIL
- [ ] Test 1.3.4: Dashboard Pattern - PASS/FAIL

### Phase 2: Skill Composition
- [ ] Test 2.1.1: Cross-Domain - PASS/FAIL
- [ ] Test 2.1.2: Pattern + Principles - PASS/FAIL

### Phase 3: Practical Application
- [ ] Test 3.1: Component Generation - PASS/FAIL
- [ ] Test 3.2: Form Generation - PASS/FAIL
- [ ] Test 3.3: Advice/Guidance - PASS/FAIL

### Phase 4: Token Efficiency
- [ ] Test 4.1: Context Size - PASS/FAIL (Tokens: _____)

### Phase 5: Cross-Reference
- [ ] Test 5.1.1: Core → Pattern - PASS/FAIL
- [ ] Test 5.1.2: Pattern → Domain - PASS/FAIL

### Phase 6: Edge Cases
- [ ] Test 6.1: Ambiguous Requests - PASS/FAIL
- [ ] Test 6.2: Conflicting Information - PASS/FAIL

## Overall Results
- Total Tests: 22
- Passed: ___
- Failed: ___
- Pass Rate: ___%

## Issues Found
[List any issues discovered during testing]

## Recommendations
[Suggestions for improvements]
```

## Success Criteria Summary

The skills framework migration is successful if:

1. **Discovery Rate**: ≥90% of queries trigger correct skill loading
2. **Composition**: Multi-skill requests successfully integrate knowledge
3. **Code Quality**: Generated code follows all core principles
4. **Token Efficiency**: Average context <8K tokens (vs 10.5K baseline)
5. **No Router Needed**: Claude routes naturally without explicit @seamstress mention
6. **Skill References**: Claude explicitly cites skills by name
7. **Accuracy**: Generated code has no violations of core principles

## Quick Validation Checklist

Run these 5 quick tests for rapid validation:

1. ✅ Ask "What are Seamstress golden rules?" → Gets core-principles
2. ✅ Ask "Explain list view pattern" → Gets list-view-pattern
3. ✅ Ask "Generate a skills list page" → Code has PageHeaderComposable + theme tokens
4. ✅ Ask "How do routes work?" → Gets routing-patterns with /entity/{entityId} format
5. ✅ Ask "Build a form for agents" → Code has validation + isDirty + unsaved warning

If all 5 pass: **System is functional** ✓

## Troubleshooting

### Skills Not Being Discovered

**Issue**: Claude doesn't cite skills by name
**Possible Causes**:
- Skill description not specific enough
- Skill name doesn't match query keywords
- Claude isn't recognizing .claude/skills directory

**Solution**:
1. Check skill YAML frontmatter has clear description
2. Verify files are in correct directory structure
3. Try more specific prompts with keywords from skill descriptions

### Wrong Skills Loaded

**Issue**: Claude loads irrelevant skills
**Possible Causes**:
- Skill descriptions overlap
- Keywords too broad

**Solution**:
1. Make skill descriptions more specific
2. Add negative keywords ("Use when..." vs "Don't use when...")
3. Refine prompt to be more precise

### Generated Code Violates Principles

**Issue**: Code has hardcoded values or wrong structure
**Possible Causes**:
- Core principles not being loaded/applied
- Pattern skill doesn't reference core principles

**Solution**:
1. Update pattern skills to explicitly reference core-principles
2. Add validation examples to skills
3. Make principles more prominent in skill content

## Next Steps After Testing

1. **Document Results**: Fill out test results template
2. **Identify Gaps**: Note which skills need improvement
3. **Refine Skills**: Update skill descriptions/content based on findings
4. **Iterate**: Re-run tests after changes
5. **Validate Token Savings**: Measure actual token usage improvement

## Maintenance Guidelines

### When to Update Skills

- **Monthly**: Review skill accuracy and relevance
- **After Major Changes**: Update skills when codebase changes significantly
- **User Feedback**: Update when patterns emerge from user requests

### Skill Quality Checklist

For each skill, ensure:
- [ ] Clear, specific description with keywords
- [ ] Concise content (avoid duplication)
- [ ] Practical examples
- [ ] Cross-references to related skills
- [ ] Up-to-date with current codebase

---

**Version**: 1.0.0
**Last Updated**: 2025-10-23
**Status**: ✅ Ready for Testing

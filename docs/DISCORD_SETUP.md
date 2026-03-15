# AIGP Community Discord Server Setup Guide

## Server Structure

### Categories and Channels

#### 📢 WELCOME
- **#welcome** - New member greetings and server rules
- **#announcements** - Official AIGP updates and releases
- **#getting-started** - Quick start guide and FAQ

#### 💬 GENERAL
- **#general** - General discussion about AIGP
- **#introductions** - Introduce yourself and your use case
- **#showcase** - Share diagrams you've created
- **#feedback** - Suggestions for improving AIGP

#### 🛠️ DEVELOPMENT
- **#contributors** - For active contributors
- **#pull-requests** - PR notifications and discussions
- **#bug-reports** - Report issues and bugs
- **#feature-requests** - Propose new features
- **#architecture** - Discuss protocol design decisions

#### 📚 HELP & SUPPORT
- **#help-protocol** - Questions about AIGP JSON schema
- **#help-cli** - CLI tool support
- **#help-plugins** - Diagram type plugins
- **#help-converters** - Format conversion issues
- **#help-layout** - Layout engine questions

#### 🤖 AI & SKILLS
- **#ai-skills** - Discuss Claude AI Skills for AIGP
- **#prompt-engineering** - Share prompts for diagram generation
- **#llm-integration** - Integrate AIGP with LLMs

#### 🌍 COMMUNITY
- **#off-topic** - Non-AIGP discussions
- **#events** - Community events and workshops
- **#resources** - Helpful links and tutorials
- **#jobs** - Job postings related to diagramming

#### 🔧 BOT COMMANDS
- **#bot-commands** - Interact with AIGP bot

---

## Server Roles

### Administrative
- **@Owner** - Server owner
- **@Admin** - Core maintainers
- **@Moderator** - Community moderators

### Contribution Tiers
- **@Core Contributor** - 10+ merged PRs
- **@Contributor** - 3+ merged PRs
- **@First PR** - First PR merged
- **@Bug Hunter** - Reported valid bugs

### Activity Roles
- **@Active Member** - Regularly active in discussions
- **@Helper** - Helps others in support channels
- **@Showcase Star** - Creates impressive diagrams

### Special Roles
- **@AI Integrator** - Built LLM integrations with AIGP
- **@Plugin Developer** - Created custom plugins
- **@Layout Designer** - Contributed layout engines
- **@Early Adopter** - Joined in the first month

---

## Discord Bot Configuration

### AIGP Bot Commands

#### Diagram Generation
```
/diagram <description>
Example: /diagram flowchart for user authentication with login, validate, and error handling
```

#### Validation
```
/validate <json>
Validates AIGP JSON against the schema
```

#### Conversion
```
/convert <format> <content>
Example: /convert mermaid graph TD; A-->B
```

#### Help
```
/help - Show all commands
/docs - Link to documentation
/examples - Show example diagrams
```

#### GitHub Integration
```
/pr <number> - Show PR details
/issue <number> - Show issue details
/releases - Show recent releases
```

### Bot Permissions Required
- Read Messages
- Send Messages
- Embed Links
- Attach Files
- Use Slash Commands
- Manage Messages (for moderation)

### Webhook Integrations
1. **GitHub Webhook** - Post new PRs, issues, releases to #pull-requests and #announcements
2. **CI/CD Webhook** - Post build status to #contributors
3. **npm Webhook** - Post new package versions to #announcements

---

## Welcome Message Template

```markdown
# Welcome to AIGP Community! 👋

Thanks for joining the AIGP (AI Graphic Protocol) community!

## 🚀 Quick Start
1. Read the docs: https://aigp.dev/docs
2. Install the CLI: `pnpm add -g @aigraphia/cli`
3. Try an example: `aigp validate examples/flowchart.json`

## 💡 Get Involved
- **Using AIGP?** Share your diagrams in #showcase
- **Found a bug?** Report it in #bug-reports
- **Want to contribute?** Check out CONTRIBUTING.md
- **Need help?** Ask in the #help-* channels

## 📋 Server Rules
1. Be respectful and constructive
2. No spam or self-promotion
3. Keep discussions on-topic
4. Search before asking (use Discord search)
5. Share knowledge - help others when you can

## 🎯 Get These Roles
React with:
- 🛠️ for **@Contributor** (if you've contributed)
- 🤖 for **@AI Integrator** (if you've built LLM integrations)
- 🎨 for **@Plugin Developer** (if you've created plugins)

Let's build the future of AI-native diagrams together! 🚀
```

---

## Auto-Moderation Rules

### AutoMod Filters
1. **Spam Prevention**
   - Max 5 messages per minute per user
   - Detect repeated messages
   - Block invite links (except approved partners)

2. **Content Filtering**
   - Block profanity
   - Flag harassment
   - Prevent @everyone/@here abuse

3. **Link Filtering**
   - Whitelist: github.com, aigp.dev, npmjs.com, mermaid.js.org
   - Require 10 messages before posting external links

### Verification
- **Entry Gate**: React to rules to gain access
- **Phone Verification**: Required after 100 members
- **2FA Required**: For moderators and admins

---

## Community Events

### Weekly Events
- **📅 Monday**: Office Hours - Ask core maintainers anything
- **🛠️ Wednesday**: Contributor Workshop - Work on PRs together
- **🎨 Friday**: Showcase Day - Demo your AIGP projects

### Monthly Events
- **First Friday**: Community Call - Roadmap updates
- **Third Saturday**: Hackathon - Build integrations
- **Last Sunday**: Learning Session - Deep dive into AIGP internals

---

## Server Settings

### Verification Level
- Medium (verified email required)

### Explicit Content Filter
- Scan messages from all members

### Default Notification Settings
- Only @mentions

### 2FA Requirement
- Required for moderators

### Server Boosts
Benefits at Level 1 (2 boosts):
- Better audio quality in voice channels
- Custom server invite background
- Animated server icon

Benefits at Level 2 (15 boosts):
- 150 emoji slots
- Custom stickers
- HD video in voice channels

Benefits at Level 3 (30 boosts):
- Vanity URL (discord.gg/aigp)
- Custom role icons

---

## Moderator Guidelines

### Response Times
- #help-* channels: < 4 hours
- #bug-reports: < 12 hours
- DMs: < 24 hours

### Common Scenarios

**Duplicate Questions**
> "Thanks for your question! This has been answered before. Check out this thread: [link]"

**Off-Topic Discussion**
> "Hey! This is interesting but a bit off-topic for this channel. Let's move to #off-topic 👍"

**Feature Requests**
> "Great idea! Can you open an issue on GitHub with more details? https://github.com/aigp/aigp/issues/new"

**Bug Reports**
> "Thanks for reporting! Can you provide:
> 1. Your AIGP version (`aigp --version`)
> 2. The command you ran
> 3. Expected vs actual output"

**Toxic Behavior**
1. First offense: Warning via DM
2. Second offense: 24-hour timeout
3. Third offense: 7-day ban
4. Fourth offense: Permanent ban

---

## Launch Checklist

### Pre-Launch
- [ ] Create server with proper structure
- [ ] Set up all channels and categories
- [ ] Configure roles and permissions
- [ ] Set up AIGP bot
- [ ] Test webhook integrations
- [ ] Write and post rules
- [ ] Create welcome message
- [ ] Configure auto-moderation
- [ ] Set verification level
- [ ] Invite core team members
- [ ] Test bot commands

### Launch Day
- [ ] Announce on Twitter
- [ ] Announce on Hacker News
- [ ] Add Discord link to GitHub README
- [ ] Add Discord link to website
- [ ] Post in #announcements
- [ ] Pin important messages
- [ ] Monitor for spam/issues

### Post-Launch (First Week)
- [ ] Welcome new members personally
- [ ] Answer questions promptly
- [ ] Share showcase examples
- [ ] Host first community call
- [ ] Gather feedback on server structure
- [ ] Adjust channels based on usage

---

## Growth Strategy

### Milestones
- **100 members**: Add phone verification
- **500 members**: Add more moderators
- **1000 members**: Add specialized channels
- **5000 members**: Consider voice channels for calls

### Partnership
- Partner with diagram tool communities
- Cross-promote with Mermaid, PlantUML communities
- Collaborate with AI developer communities

### Content Strategy
- Weekly "Diagram of the Week" feature
- Monthly contributor spotlight
- Tutorial series in #resources
- Case study presentations

---

## Success Metrics

### Track Monthly
- New members joined
- Active members (messaged in last 7 days)
- Messages per day
- Help questions answered
- PRs discussed
- Community events attendance

### Goals (First Quarter)
- 500+ members
- 50+ active daily users
- 100+ messages per day
- 10+ community events
- 5+ new contributors from Discord

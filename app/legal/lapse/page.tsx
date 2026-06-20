import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lapse — Privacy Policy',
  description: 'Privacy Policy for the Lapse Android app by Sohneg.ch.',
}

export default function LapsePrivacyPolicy() {
  return (
    <article>
      <h1>Privacy Policy — Lapse</h1>

      <p>
        <strong>Lapse — Time Awareness</strong>
        <br />
        Last updated: 28 March 2026
      </p>

      <hr />

      <h2>Developer</h2>
      <p>
        Sohneg.ch
        <br />
        <a href="mailto:contact@sohneg.ch">contact@sohneg.ch</a>
        <br />
        <a href="https://sohneg.ch" target="_blank" rel="noopener noreferrer">
          https://sohneg.ch
        </a>
      </p>

      <hr />

      <h2>Overview</h2>
      <p>
        Lapse is a screen time awareness app that helps you track how much time you spend in selected
        apps. Your privacy is important to us. This policy explains what data the app accesses and how
        it is handled.
      </p>

      <hr />

      <h2>Data Collection</h2>
      <p>
        <strong>Lapse does not collect, transmit, or share any personal data.</strong> All data is
        stored locally on your device and never leaves it.
      </p>

      <hr />

      <h2>Data Stored on Your Device</h2>
      <p>Lapse stores the following data locally:</p>
      <ul>
        <li>
          <strong>Session history</strong> — Records which monitored apps were used and for how long
          (app package name, start time, duration, date). This data is stored in a local database on
          your device.
        </li>
        <li>
          <strong>User preferences</strong> — Your settings such as selected apps to monitor, timer
          appearance, pulse interval, and warning thresholds. Stored in local shared preferences.
        </li>
      </ul>
      <p>
        This data is never transmitted to any server, third party, or external service.
      </p>

      <hr />

      <h2>Permissions</h2>
      <p>Lapse requires the following permissions to function:</p>
      <ul>
        <li>
          <strong>Display over other apps (SYSTEM_ALERT_WINDOW)</strong> — Used to show the floating
          timer overlay on top of other apps. No screen content is captured or recorded.
        </li>
        <li>
          <strong>Accessibility Service</strong> — Used solely to detect which app is currently in
          the foreground. Lapse does not read, capture, or store any screen content, text, or user
          interactions. The accessibility service only observes app window change events to start and
          stop the timer.
        </li>
        <li>
          <strong>Foreground Service</strong> — Used to keep the timer running while a monitored app
          is in use.
        </li>
        <li>
          <strong>Notifications</strong> — Used to display a persistent notification while the timer
          is active, as required by Android for foreground services.
        </li>
      </ul>

      <hr />

      <h2>Third-Party Services</h2>
      <p>
        Lapse does not use any third-party services, SDKs, analytics tools, advertising networks, or
        crash reporting services.
      </p>

      <hr />

      <h2>Data Sharing</h2>
      <p>
        Lapse does not share any data with third parties. No data is collected, so no data can be
        shared.
      </p>

      <hr />

      <h2>Data Retention and Deletion</h2>
      <p>All data is stored locally on your device. You can delete all app data at any time by:</p>
      <ul>
        <li>Clearing the app data through Android Settings</li>
        <li>Uninstalling the app</li>
      </ul>

      <hr />

      <h2>Children&rsquo;s Privacy</h2>
      <p>
        Lapse is not directed at children under the age of 13. The app does not collect any personal
        information from any user, regardless of age.
      </p>

      <hr />

      <h2>Changes to This Policy</h2>
      <p>
        We may update this privacy policy from time to time. Any changes will be reflected in the
        “Last updated” date at the top of this document. The current version is always available at:
      </p>
      <p>
        <a href="https://sohneg.ch/legal/lapse" target="_blank" rel="noopener noreferrer">
          https://sohneg.ch/legal/lapse
        </a>
      </p>

      <hr />

      <h2>Contact</h2>
      <p>
        If you have any questions about this privacy policy, please contact us at:
      </p>
      <p>
        <strong>Sohneg.ch</strong>
        <br />
        Email: <a href="mailto:contact@sohneg.ch">contact@sohneg.ch</a>
        <br />
        Website:{' '}
        <a href="https://sohneg.ch" target="_blank" rel="noopener noreferrer">
          https://sohneg.ch
        </a>
      </p>
    </article>
  )
}

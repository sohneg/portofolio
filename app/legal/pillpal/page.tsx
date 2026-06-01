import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PillPal — Terms of Service & Privacy Policy',
  description: 'Terms of Service and Privacy Policy for the PillPal Android app by Sohneg.ch.',
}

export default function PillPalLegal() {
  return (
    <>
      <article>
        <h1>Terms of Service — PillPal</h1>

        <p>
          <strong>Effective:</strong> 3 May 2026
          <br />
          <strong>Provider:</strong> Sohneg.ch, Luzern, Switzerland
          <br />
          <strong>Contact:</strong> <a href="mailto:contact@sohneg.ch">contact@sohneg.ch</a>
        </p>

        <hr />

        <h2>1. Scope and acceptance</h2>
        <p>
          These Terms of Service (the “Terms”) govern your use of the Android application{' '}
          <strong>PillPal</strong> (the “App”), provided by Sohneg.ch, Luzern, Switzerland (the
          “Provider”, “we”, “us”). By installing or using the App you agree to these Terms. If you do
          not agree, do not install or use the App.
        </p>

        <hr />

        <h2>2. License and permitted use</h2>
        <p>
          We grant you a non-exclusive, non-transferable, revocable license to install and use the
          App on any Android device you own or control, solely for personal, non-commercial purposes.
        </p>
        <p>You may not:</p>
        <ul>
          <li>
            copy, modify, decompile, reverse-engineer or create derivative works of the App, except
            as permitted by mandatory law;
          </li>
          <li>resell, sublicense, rent or otherwise commercially exploit the App;</li>
          <li>circumvent the in-app purchase mechanism or any technical protection measure;</li>
          <li>use the App for any unlawful purpose.</li>
        </ul>

        <hr />

        <h2>3. In-app purchases (PillPal Pro)</h2>
        <p>
          The App is free to install. Certain optional features are unlocked through a one-time
          in-app purchase (“PillPal Pro”) processed by Google Play Billing. The Provider does not
          collect or store your payment data; the purchase agreement for the Pro unlock is concluded
          between you and Google.
        </p>
        <p>
          Refunds for in-app purchases are handled exclusively by Google according to Google Play’s
          refund policy. Beyond Google’s refund window we do not provide refunds, except where
          required by mandatory consumer-protection law.
        </p>

        <hr />

        <h2>4. Medical disclaimer and limitation of liability</h2>

        <h3>4.1 Reminder tool, not a medical device</h3>
        <p>
          PillPal is a personal organisational tool that helps you remember to take medication you
          have already chosen to use. <strong>The App is not a medical device, does not provide
          medical advice, diagnosis or treatment, and is not a substitute for professional medical
          judgement.</strong> Decisions about which medication to take, in which dose and at which
          time are yours and your healthcare provider’s responsibility — not ours.
        </p>

        <h3>4.2 Reminders may fail</h3>
        <p>
          Even when correctly configured, reminders may not fire on time or at all, for reasons
          including but not limited to:
        </p>
        <ul>
          <li>
            aggressive battery optimisation or background restrictions imposed by your device
            manufacturer (Samsung, Xiaomi, Huawei, Honor and others are known to silently suppress
            background alarms);
          </li>
          <li>
            your device being in silent or do-not-disturb mode, or the volume being turned down;
          </li>
          <li>the device being switched off, in flight mode or out of battery;</li>
          <li>the App being force-stopped, uninstalled or updated;</li>
          <li>OS-level limits on exact alarms, full-screen intents or notifications;</li>
          <li>bugs in the App, the Android OS or third-party software running on your device.</li>
        </ul>
        <p>
          You are solely responsible for verifying that reminders actually fire on your device and
          for taking your medication on time, regardless of whether the App reminded you.
        </p>

        <h3>4.3 Critical or life-sustaining medication</h3>
        <p>
          <strong>Do not rely on PillPal as the sole reminder for medication where a missed dose
          could cause serious harm or death</strong> (for example insulin, anti-coagulants,
          anti-rejection drugs, anti-epileptics, opioids, cardiac medication). For such medication
          you must combine the App with additional safeguards — for example a physical pill
          organiser, a second independent reminder source, or supervision by a caregiver.
        </p>

        <h3>4.4 Journal entries and advisories</h3>
        <p>
          The App allows you to log self-measured health values (blood pressure, blood sugar, pulse,
          weight, mood, sleep, water intake, pain, notes). When a logged value falls outside common
          reference ranges, the App may show a coloured advisory marker (yellow for elevated, red for
          critical) based on public guideline thresholds. <strong>These markers are educational
          information, not a medical opinion.</strong> Reference ranges vary by individual, age and
          condition. Always discuss your readings with a qualified healthcare professional before
          drawing any conclusion or changing your treatment.
        </p>

        <h3>4.5 Emergencies</h3>
        <p>
          <strong>PillPal is not an emergency service.</strong> If you experience a medical
          emergency, suspect an overdose, or have a critical reading, contact emergency services
          immediately:
        </p>
        <ul>
          <li>
            <strong>Switzerland:</strong> 144 (medical) · 112 (general)
          </li>
          <li>
            <strong>European Union:</strong> 112
          </li>
          <li>
            <strong>United Kingdom:</strong> 999 or 112
          </li>
          <li>
            <strong>United States / Canada:</strong> 911
          </li>
        </ul>

        <h3>4.6 Limitation of liability</h3>
        <p>
          To the maximum extent permitted by applicable law, the Provider shall not be liable for any
          direct, indirect, incidental, consequential or punitive damages arising out of or in
          connection with your use of, or inability to use, the App — including without limitation
          any harm resulting from a missed, late or incorrect medication reminder.
        </p>
        <p>
          Liability for damages caused by intent or gross negligence on the part of the Provider, and
          any liability that cannot be excluded under mandatory law (in particular liability for
          personal injury caused by intent or gross negligence), remains unaffected by this section.
        </p>

        <hr />

        <h2>5. Service availability and warranties</h2>
        <p>
          The App is provided “as is” and “as available”. We do not warrant that the App will be
          uninterrupted, error-free, secure, or compatible with every Android version, device or
          configuration. We may add, modify or discontinue features at any time without prior notice.
        </p>
        <p>Any statutory warranties that cannot be excluded under mandatory law remain unaffected.</p>

        <hr />

        <h2>6. Termination</h2>
        <p>
          You may end this agreement at any time by uninstalling the App from your device. We may
          suspend or terminate your access to the App if you breach these Terms or use the App in a
          manner that harms us, other users or third parties.
        </p>
        <p>The medical disclaimer and limitation of liability (section 4) survive termination.</p>

        <hr />

        <h2>7. Governing law and jurisdiction</h2>
        <p>
          These Terms are governed by the substantive laws of Switzerland, excluding its
          conflict-of-laws rules and the United Nations Convention on Contracts for the International
          Sale of Goods (CISG).
        </p>
        <p>
          The exclusive place of jurisdiction is Luzern, Switzerland. <strong>Mandatory
          consumer-protection rights of the user’s country of residence remain unaffected.</strong>{' '}
          If you are a consumer resident in the EU, you may also bring proceedings before the courts
          of your country of residence to the extent permitted by mandatory law.
        </p>

        <hr />

        <h2>8. Contact</h2>
        <p>
          Sohneg.ch
          <br />
          Luzern, Switzerland
          <br />
          <a href="mailto:contact@sohneg.ch">contact@sohneg.ch</a>
        </p>
      </article>

      <hr />

      <article>
        <h1>Privacy Policy — PillPal</h1>

        <p>
          <strong>Effective:</strong> 3 May 2026
          <br />
          <strong>Provider:</strong> Sohneg.ch, Luzern, Switzerland
          <br />
          <strong>Contact:</strong> <a href="mailto:contact@sohneg.ch">contact@sohneg.ch</a>
        </p>

        <hr />

        <h2>1. Overview</h2>
        <p>
          This Privacy Policy describes how Sohneg.ch (“we”, “us”) handles personal data in
          connection with the Android application <strong>PillPal</strong> (the “App”). We comply
          with the EU General Data Protection Regulation (GDPR) and the revised Swiss Federal Act on
          Data Protection (FADP).
        </p>
        <p>
          PillPal is designed to be <strong>local-first</strong>: the data you enter stays on your
          device. We do not operate a backend that stores or processes your medication, dose, journal
          or appointment data.
        </p>

        <hr />

        <h2>2. Data collection and use</h2>

        <h3>2.1 Data stored locally on your device</h3>
        <p>
          The App stores the following data exclusively on your device, in app-private storage
          protected by Android’s app sandbox:
        </p>
        <ul>
          <li>
            <strong>Medications</strong> — name, dosage, notes, optional photo, colour marker,
            ringtone, validity dates, “critical” flag, side-effect follow-up window;
          </li>
          <li>
            <strong>Reminder schedules</strong> — time slots, weekdays, frequency pattern;
          </li>
          <li>
            <strong>Dose history</strong> — taken, missed, skipped events with timestamps and
            optional per-dose notes;
          </li>
          <li>
            <strong>Profiles</strong> — display name, avatar initial and colour (the App supports up
            to three profiles for family members or care recipients);
          </li>
          <li>
            <strong>Appointments</strong> — title, date and time, location, notes, reminder offset
            (Pro feature);
          </li>
          <li>
            <strong>Journal entries</strong> — self-measured health values you choose to log:
            <ul>
              <li>blood pressure (systolic, diastolic);</li>
              <li>blood sugar;</li>
              <li>pulse (with “at rest” / “after exertion” context);</li>
              <li>weight;</li>
              <li>water intake;</li>
              <li>mood, sleep duration, pain level;</li>
              <li>free-text notes.</li>
            </ul>
          </li>
          <li>
            <strong>Voice recordings</strong> — if you record a voice clip to use as a reminder sound
            (Pro feature), the audio file is stored in app-private storage on your device only;
          </li>
          <li>
            <strong>App settings</strong> — language, active profile, default ringtone, mute window,
            Pro-unlock status.
          </li>
        </ul>
        <p>
          <strong>None of this data leaves your device.</strong> We do not have access to it, and no
          copy is uploaded to any server we operate. If you uninstall the App, this data is deleted
          by Android.
        </p>

        <h3>2.2 Crash reports</h3>
        <p>
          The App does not collect or transmit its own crash reports. Crash reports that you
          voluntarily send to Google through the Android system dialog are governed by Google’s
          privacy policy and are not received by us.
        </p>

        <h3>2.3 No analytics infrastructure</h3>
        <p>
          The App does not use any analytics SDK (no Firebase Analytics, no third-party usage
          tracking) and does not measure how individual users interact with the App.
        </p>

        <hr />

        <h2>3. Advertising (Google AdMob)</h2>
        <p>
          Free users see banner advertisements provided by Google AdMob. To deliver and measure these
          ads, AdMob processes:
        </p>
        <ul>
          <li>your device’s advertising ID (you can reset or delete this in Android settings);</li>
          <li>technical device data (model, Android version, screen size, language);</li>
          <li>approximate IP-based location;</li>
          <li>ad-interaction events (impressions, clicks).</li>
        </ul>
        <p>
          AdMob is operated by Google Ireland Limited as data controller for the advertising service.
          Personalised ads in the EU/EEA require your prior consent, which is collected through
          Google’s consent flow (UMP). See{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Google’s privacy policy
          </a>
          . Legal basis: your consent (GDPR Art. 6(1)(a)) for personalised advertising; legitimate
          interest (GDPR Art. 6(1)(f)) for non-personalised advertising in the free tier.
        </p>
        <p>
          <strong>Ads are removed entirely by purchasing PillPal Pro.</strong>
        </p>

        <hr />

        <h2>4. In-app purchases (Google Play Billing)</h2>
        <p>
          The Pro unlock is processed through Google Play Billing. The App receives only an opaque
          purchase token confirming the purchase — no payment card, name, address or other financial
          data. The contractual relationship for the purchase itself is between you and Google. See{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Google’s privacy policy
          </a>{' '}
          for how Google processes your purchase data. Legal basis: performance of contract (GDPR Art.
          6(1)(b)).
        </p>

        <hr />

        <h2>5. Permissions</h2>
        <p>The App requests the following Android permissions to function:</p>
        <ul>
          <li>
            <strong>POST_NOTIFICATIONS</strong> — to display reminders;
          </li>
          <li>
            <strong>SCHEDULE_EXACT_ALARM</strong> — to fire reminders at the exact configured minute
            (without it, Android may delay reminders by several minutes);
          </li>
          <li>
            <strong>USE_FULL_SCREEN_INTENT</strong> and <strong>SYSTEM_ALERT_WINDOW</strong> — to
            display the lock-screen alarm overlay for medications you mark as “critical” (Pro
            feature);
          </li>
          <li>
            <strong>RECORD_AUDIO</strong> — only when you explicitly choose to record a voice clip as
            a reminder sound (Pro feature). Recordings are saved on the device only;
          </li>
          <li>
            <strong>RECEIVE_BOOT_COMPLETED</strong> — to re-schedule your alarms after the device
            reboots;
          </li>
          <li>
            <strong>REQUEST_IGNORE_BATTERY_OPTIMIZATIONS</strong> — to ask you to whitelist the App so
            background battery management does not suppress reminders;
          </li>
          <li>
            <strong>FOREGROUND_SERVICE</strong> and{' '}
            <strong>FOREGROUND_SERVICE_MEDIA_PLAYBACK</strong> — to play the reminder sound reliably
            even when the App is not in the foreground;
          </li>
          <li>
            <strong>VIBRATE</strong> — to vibrate when a reminder fires;
          </li>
          <li>
            <strong>INTERNET</strong> — required by Google AdMob (for free users) and Google Play
            Billing (for the Pro purchase). The App itself does not contact any other server.
          </li>
        </ul>

        <hr />

        <h2>6. Minors</h2>
        <p>
          The App is not directed at children under the age of 16. We do not knowingly collect data
          from children. If you are a parent or guardian and believe your child has provided personal
          data, please contact us so we can advise — although in practice, all medication and health
          data is stored only on the device and is not received by us.
        </p>

        <hr />

        <h2>7. Disclosure to third parties</h2>
        <p>
          We do not sell, trade or rent personal data. The only third parties involved are Google (as
          operator of AdMob and Google Play Billing), who process the limited categories of data
          described in sections 3 and 4 in their own capacity as data controller. Both services are
          operated by Google entities in Ireland and may transfer data outside Switzerland and the EU
          under appropriate safeguards (Standard Contractual Clauses, adequacy decisions). See{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Google’s privacy policy
          </a>
          .
        </p>

        <hr />

        <h2>8. Your rights (GDPR / FADP)</h2>
        <p>
          Because all medication, dose, journal and appointment data is stored exclusively on your
          device, you are the sole controller of that data. Within the App you can at any time edit,
          export (Pro feature, CSV/PDF) or delete your entries. Uninstalling the App removes all
          locally stored data.
        </p>
        <p>
          With respect to any data processed by us as controller (in practice limited to your contact
          email if you write to us), you have the right to:
        </p>
        <ul>
          <li>access your data (GDPR Art. 15);</li>
          <li>have your data corrected (GDPR Art. 16);</li>
          <li>have your data erased (GDPR Art. 17);</li>
          <li>restrict processing (GDPR Art. 18);</li>
          <li>data portability (GDPR Art. 20);</li>
          <li>object to processing based on legitimate interests (GDPR Art. 21);</li>
          <li>
            withdraw consent at any time, without affecting the lawfulness of past processing (GDPR
            Art. 7(3)).
          </li>
        </ul>
        <p>
          Equivalent rights apply under the revised Swiss FADP. You may exercise any of these rights
          by writing to <a href="mailto:contact@sohneg.ch">contact@sohneg.ch</a>. You also have the
          right to lodge a complaint with a supervisory authority — in Switzerland, the Federal Data
          Protection and Information Commissioner (FDPIC); in the EU, the supervisory authority of
          your member state.
        </p>

        <hr />

        <h2>9. Data security</h2>
        <p>
          All medication, dose, journal and appointment data is stored in app-private storage on your
          device, which is isolated from other apps by the Android sandbox and (on modern Android
          versions) encrypted at rest as part of file-based encryption. We have no remote backend, so
          there is no server-side data store that could be breached.
        </p>
        <p>
          Voice recordings, if you create any, are stored in the same app-private location and are
          never transmitted off your device.
        </p>

        <hr />

        <h2>10. Changes to this Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time, for example to reflect new features or
          changes in applicable law. The current version is always available at the URL where you
          accessed this document. Material changes will be highlighted in the App release notes.
        </p>

        <hr />

        <h2>11. Governing law</h2>
        <p>
          This Privacy Policy is governed by Swiss law. Mandatory data-protection rights granted by
          your country of residence remain unaffected.
        </p>

        <hr />

        <h2>12. Contact</h2>
        <p>
          Sohneg.ch
          <br />
          Luzern, Switzerland
          <br />
          <a href="mailto:contact@sohneg.ch">contact@sohneg.ch</a>
        </p>
      </article>
    </>
  )
}

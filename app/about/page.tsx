export default function About() {
  return (
    <main className="min-h-screen flex flex-col justify-center max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">About</h1>

      <div className="space-y-8">
        <div>
          <p className="text-sm text-secondary mb-2">Who am I?</p>
          <p>
            I'm Simon, a certified developer from Kriens, Switzerland. As a kid, I said
            I'd become either a baker or a developer – life made me both. After 10 years
            as a baker, a flour allergy gave me the push to turn my longtime hobby into
            my career.
          </p>
        </div>

        <div>
          <p className="text-sm text-secondary mb-2">What do I do?</p>
          <p>
            I build tools that make life easier. Currently at Brabender Solutions, I'm
            developing a complete business system – CRM, time tracking, document management,
            and more – using Blazor and WPF. In previous roles, I created a VR marketing app
            for elevator manufacturers. Outside of work, I founded Tuning Schweiz, a car
            community with over 8,500 members, for which I developed a custom event app.
          </p>
        </div>

        <div>
          <p className="text-sm text-secondary mb-2">What do I work with?</p>
          <p>
            C#, Blazor, WPF, Angular, TypeScript, Flutter, Python, Docker – and Unreal
            Engine 5 and Unity for game development. I also enjoy tinkering with Raspberry
            Pi projects, like the dog camera that sends Discord updates of our two Pomskies.
          </p>
        </div>

        <div>
          <p className="text-sm text-secondary mb-2">Beyond the code?</p>
          <p>
            I make music and occasionally DJ in VRChat. When I'm offline, I'm probably
            out walking our two Pomskies.
          </p>
        </div>
      </div>
    </main>
  )
}
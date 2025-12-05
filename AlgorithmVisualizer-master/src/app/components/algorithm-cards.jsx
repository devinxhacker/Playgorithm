import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Network, GitBranch, ArrowUpDown, Crown, Cpu, Hash, Search, Grid3x3 } from 'lucide-react'

const algorithms = [
  {
    id: 'pathfinder',
    title: "Pathfinder",
    description: "Visualize graph algorithms like dijkstra, BFS, DFS",
    icon: Network,
    color: '#00d4ff'
  },
  {
    id: 'recursion-tree',
    title: 'Recursion Tree',
    description: "The process in which a function calls itself directly or indirectly is called recursion",
    icon: GitBranch,
    color: '#00ff88'
  },
  {
    id: 'sorting',
    title: 'Sorting Algorithm',
    description: "Compare different sorting algorithms",
    icon: ArrowUpDown,
    color: '#ff6b35'
  },
  {
    id: 'recursive-sorting',
    title: 'Recursive Sorting',
    description: "Compare different recursive sorting algorithms",
    icon: ArrowUpDown,
    color: '#ffc107'
  },
  {
    id: 'n-queen',
    title: 'N Queen',
    description: "The N queens puzzle is the problem of placing N chess queens on an N*N chessboard so that no two queens threaten each other",
    icon: Crown,
    color: '#ff0080'
  },
  {
    id: 'prime-numbers',
    title: 'Prime Numbers',
    description: "Visualize how Seive is better than brute force",
    icon: Hash,
    color: '#9c27b0'
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    description: "Binary search is an efficient algorithm for finding an item from a sorted list of item",
    icon: Search,
    color: '#4caf50'
  },
  {
    id: '15-puzzle',
    title: '15 Puzzle',
    description: "The 15-puzzle is a sliding puzzle that consists of a frame of numbered square tiles in random order with one tile missing",
    icon: Grid3x3,
    color: '#2196f3'
  }
]

export function AlgorithmCards() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {algorithms.map((algorithm) => {
        const IconComponent = algorithm.icon;
        return (
          <Link key={algorithm.id} href={`/${algorithm.id}`} className="block group">
            <Card className="overflow-hidden transition-shadow hover:shadow-lg h-full flex flex-col cursor-target">
              <div className="relative h-48 flex items-center justify-center" style={{ backgroundColor: `${algorithm.color}20` }}>
                <IconComponent 
                  size={80} 
                  style={{ color: algorithm.color }}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <CardHeader className="flex-grow">
                <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300">
                  {algorithm.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <p className="text-lg text-muted-foreground">{algorithm.description}</p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  )
}

